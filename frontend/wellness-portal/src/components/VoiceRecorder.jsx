import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Send,
  Loader2,
  Volume2
} from 'lucide-react'

const VoiceRecorder = ({ 
  onRecordingComplete, 
  onTranscriptionComplete,
  maxDuration = 300, // 5 minutes
  language = 'ar',
  autoTranscribe = true 
}) => {
  const { t } = useTranslation()
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const audioRef = useRef(null)
  
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [error, setError] = useState(null)
  const [permissionGranted, setPermissionGranted] = useState(null)

  // Timer effect
  useEffect(() => {
    let interval
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            handleStopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused, maxDuration])

  // Check microphone permission
  useEffect(() => {
    checkMicrophonePermission()
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' })
      setPermissionGranted(result.state === 'granted')
      
      result.addEventListener('change', () => {
        setPermissionGranted(result.state === 'granted')
      })
    } catch (error) {
      console.error('Error checking microphone permission:', error)
    }
  }

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      })
      streamRef.current = stream
      setPermissionGranted(true)
      setError(null)
      return stream
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setError('Microphone access denied. Please allow microphone access to record audio.')
      setPermissionGranted(false)
      throw error
    }
  }

  const handleStartRecording = async () => {
    try {
      setError(null)
      
      let stream = streamRef.current
      if (!stream) {
        stream = await requestMicrophoneAccess()
      }

      audioChunksRef.current = []
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        setAudioUrl(URL.createObjectURL(audioBlob))
        
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }

        if (autoTranscribe) {
          handleTranscribe(audioBlob)
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Failed to start recording. Please check your microphone.')
    }
  }

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      // Stop all tracks to release microphone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  const handlePlayRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleDeleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription('')
    setRecordingTime(0)
    setIsPlaying(false)
  }

  const handleTranscribe = async (blob = audioBlob) => {
    if (!blob) return

    setIsTranscribing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      formData.append('language', language)

      const response = await fetch('/api/audio/stt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      setTranscription(data.transcription)
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(data.transcription, data)
      }
      
    } catch (error) {
      console.error('Transcription error:', error)
      setError('Failed to transcribe audio. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleSendTranscription = () => {
    if (transcription && onTranscriptionComplete) {
      onTranscriptionComplete(transcription, { audioBlob, audioUrl })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRecordingStatus = () => {
    if (isRecording) {
      if (isPaused) {
        return language === 'ar' ? 'متوقف مؤقتاً' : 'Paused'
      }
      return language === 'ar' ? 'جاري التسجيل...' : 'Recording...'
    }
    return language === 'ar' ? 'جاهز للتسجيل' : 'Ready to record'
  }

  if (permissionGranted === false) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <Alert>
            <Mic className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'يتطلب الوصول إلى الميكروفون لتسجيل الصوت. يرجى السماح بالوصول إلى الميكروفون.'
                : 'Microphone access is required to record audio. Please allow microphone access.'
              }
            </AlertDescription>
          </Alert>
          <Button 
            onClick={requestMicrophoneAccess} 
            className="w-full mt-4"
          >
            {language === 'ar' ? 'السماح بالوصول إلى الميكروفون' : 'Allow Microphone Access'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Recording Status */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {isRecording && (
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                isPaused ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {getRecordingStatus()}
            </span>
          </div>
          
          <div className="text-2xl font-mono text-gray-600 dark:text-gray-300">
            {formatTime(recordingTime)}
          </div>
          
          {maxDuration && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {language === 'ar' 
                ? `الحد الأقصى: ${formatTime(maxDuration)}`
                : `Max: ${formatTime(maxDuration)}`
              }
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              size="lg"
              className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700"
            >
              <Mic className="h-6 w-6" />
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePauseRecording}
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                {isPaused ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={handleStopRecording}
                size="lg"
                className="rounded-full w-16 h-16 bg-gray-600 hover:bg-gray-700"
              >
                <Square className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Playback Controls */}
        {audioUrl && !isRecording && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Button
                onClick={handlePlayRecording}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={handleDeleteRecording}
                variant="outline"
                size="sm"
                className="rounded-full text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              {autoTranscribe && (
                <Button
                  onClick={() => handleTranscribe()}
                  variant="outline"
                  size="sm"
                  disabled={isTranscribing}
                  className="rounded-full"
                >
                  {isTranscribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Transcription */}
        {transcription && (
          <div className="border-t pt-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-900 dark:text-white">
                {transcription}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleSendTranscription}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>
                  {language === 'ar' ? 'إرسال' : 'Send'}
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isTranscribing && (
          <div className="text-center mt-4">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'ar' 
                  ? 'جاري تحويل الصوت إلى نص...'
                  : 'Transcribing audio...'
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VoiceRecorder

