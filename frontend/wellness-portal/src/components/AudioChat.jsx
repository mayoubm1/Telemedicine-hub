import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Settings,
  MessageCircle,
  Bot,
  User,
  Loader2
} from 'lucide-react'
import AudioPlayer from './AudioPlayer'
import VoiceRecorder from './VoiceRecorder'

const AudioChat = ({ 
  conversationId, 
  onMessageSent, 
  messages = [], 
  isLoading = false,
  language = 'ar' 
}) => {
  const { t } = useTranslation()
  const [inputMessage, setInputMessage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('female_voice')
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [availableVoices, setAvailableVoices] = useState([])
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchAvailableVoices()
  }, [language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchAvailableVoices = async () => {
    try {
      const response = await fetch(`/api/audio/voices?language=${language}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableVoices(data.voices || [])
      }
    } catch (error) {
      console.error('Error fetching voices:', error)
    }
  }

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return

    const messageData = {
      content: message,
      timestamp: new Date().toISOString(),
      role: 'user'
    }

    if (onMessageSent) {
      await onMessageSent(messageData)
    }

    setInputMessage('')
  }

  const handleVoiceMessage = async (transcription, audioData) => {
    setShowVoiceRecorder(false)
    await handleSendMessage(transcription)
  }

  const generateAudioForMessage = async (messageContent, messageId) => {
    if (!audioEnabled || !messageContent) return null

    setIsGeneratingAudio(true)

    try {
      const response = await fetch('/api/audio/medical-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: messageContent,
          voice: selectedVoice,
          language: language,
          conversationId: conversationId
        })
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        return audioUrl
      }
    } catch (error) {
      console.error('Error generating audio:', error)
    } finally {
      setIsGeneratingAudio(false)
    }

    return null
  }

  const MessageBubble = ({ message, index }) => {
    const [audioUrl, setAudioUrl] = useState(null)
    const [isGeneratingMessageAudio, setIsGeneratingMessageAudio] = useState(false)
    const isUser = message.role === 'user'
    const isAssistant = message.role === 'assistant'

    const handleGenerateAudio = async () => {
      if (audioUrl) return // Already generated

      setIsGeneratingMessageAudio(true)
      const url = await generateAudioForMessage(message.content, message.id || index)
      if (url) {
        setAudioUrl(url)
      }
      setIsGeneratingMessageAudio(false)
    }

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}>
          {/* Message Header */}
          <div className="flex items-center space-x-2 mb-1">
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
            <span className="text-xs opacity-75">
              {isUser ? (language === 'ar' ? 'أنت' : 'You') : (language === 'ar' ? 'المساعد الطبي' : 'Medical AI')}
            </span>
          </div>

          {/* Message Content */}
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Audio Controls for AI Messages */}
          {isAssistant && audioEnabled && (
            <div className="mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
              {audioUrl ? (
                <AudioPlayer
                  audioUrl={audioUrl}
                  title={language === 'ar' ? 'الرد الصوتي' : 'Audio Response'}
                  showDownload={false}
                />
              ) : (
                <Button
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingMessageAudio}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {isGeneratingMessageAudio ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Volume2 className="h-3 w-3 mr-1" />
                  )}
                  {language === 'ar' ? 'استمع للرد' : 'Listen to Response'}
                </Button>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs opacity-50 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Audio Settings */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Settings className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'إعدادات الصوت' : 'Audio Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-4">
            {/* Audio Toggle */}
            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant={audioEnabled ? "default" : "outline"}
              size="sm"
            >
              {audioEnabled ? (
                <Volume2 className="h-4 w-4 mr-1" />
              ) : (
                <VolumeX className="h-4 w-4 mr-1" />
              )}
              {audioEnabled 
                ? (language === 'ar' ? 'الصوت مُفعل' : 'Audio On')
                : (language === 'ar' ? 'الصوت مُعطل' : 'Audio Off')
              }
            </Button>

            {/* Voice Selection */}
            {audioEnabled && availableVoices.length > 0 && (
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {language === 'ar' ? 'ابدأ محادثتك الطبية' : 'Start Your Medical Conversation'}
            </p>
            <p className="text-sm">
              {language === 'ar' 
                ? 'اكتب رسالة أو استخدم التسجيل الصوتي للحصول على المساعدة الطبية'
                : 'Type a message or use voice recording to get medical assistance'
              }
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={message.id || index} message={message} index={index} />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'ar' ? 'المساعد الطبي يكتب...' : 'Medical AI is typing...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recorder */}
      {showVoiceRecorder && (
        <div className="mb-4">
          <VoiceRecorder
            onTranscriptionComplete={handleVoiceMessage}
            language={language}
            maxDuration={180} // 3 minutes for medical queries
          />
        </div>
      )}

      {/* Input Area */}
      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="flex items-end space-x-2">
          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === 'ar' 
                ? 'اكتب استفسارك الطبي هنا...'
                : 'Type your medical question here...'
              }
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isLoading}
              className="resize-none"
            />
          </div>

          {/* Voice Recording Button */}
          <Button
            onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
            variant={showVoiceRecorder ? "default" : "outline"}
            size="sm"
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Audio Generation Status */}
        {isGeneratingAudio && (
          <Alert className="mt-2">
            <Volume2 className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'جاري توليد الرد الصوتي...'
                : 'Generating audio response...'
              }
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default AudioChat

