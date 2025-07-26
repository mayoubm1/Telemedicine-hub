import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download,
  Loader2
} from 'lucide-react'

const AudioPlayer = ({ 
  audioUrl, 
  title = 'Audio Response', 
  onPlay, 
  onPause, 
  onEnded,
  autoPlay = false,
  showDownload = true 
}) => {
  const { t } = useTranslation()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      if (onEnded) onEnded()
    }
    const handleError = (e) => {
      setError('Failed to load audio')
      setIsLoading(false)
      console.error('Audio error:', e)
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [audioUrl, onEnded])

  useEffect(() => {
    if (autoPlay && audioRef.current && !isLoading) {
      handlePlay()
    }
  }, [autoPlay, isLoading])

  const handlePlay = async () => {
    try {
      await audioRef.current.play()
      setIsPlaying(true)
      if (onPlay) onPlay()
    } catch (error) {
      console.error('Error playing audio:', error)
      setError('Failed to play audio')
    }
  }

  const handlePause = () => {
    audioRef.current.pause()
    setIsPlaying(false)
    if (onPause) onPause()
  }

  const handleSeek = (value) => {
    const newTime = (value[0] / 100) * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value) => {
    const newVolume = value[0] / 100
    setVolume(newVolume)
    audioRef.current.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const handleMuteToggle = () => {
    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const handleRestart = () => {
    audioRef.current.currentTime = 0
    setCurrentTime(0)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `${title.replace(/\s+/g, '_')}.wav`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          className="hidden"
        />
        
        {/* Title */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {title}
          </h4>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={isLoading || !duration}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause Button */}
            <Button
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={isLoading}
              size="sm"
              className="rounded-full w-10 h-10"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            {/* Restart Button */}
            <Button
              onClick={handleRestart}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center space-x-2 flex-1 max-w-32 mx-4">
            <Button
              onClick={handleMuteToggle}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8"
            >
              {isMuted ? (
                <VolumeX className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Download Button */}
          {showDownload && (
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8"
            >
              <Download className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('loadingAudio', 'Loading audio...')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AudioPlayer

