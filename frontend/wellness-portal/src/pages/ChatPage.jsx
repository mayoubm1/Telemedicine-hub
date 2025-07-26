import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageCircle, Bot, AlertTriangle } from 'lucide-react'
import AudioChat from '../components/AudioChat'

const ChatPage = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize conversation
    initializeConversation()
  }, [])

  const initializeConversation = async () => {
    try {
      const response = await fetch('/api/wellness/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          portal: 'wellness',
          language: i18n.language
        })
      })

      if (response.ok) {
        const data = await response.json()
        setConversationId(data.conversationId)
        
        // Add welcome message
        const welcomeMessage = {
          id: 'welcome',
          role: 'assistant',
          content: i18n.language === 'ar' 
            ? 'مرحباً! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك كتابة استفسارك أو استخدام التسجيل الصوتي.'
            : 'Hello! I\'m your AI medical assistant. How can I help you today? You can type your question or use voice recording.',
          timestamp: new Date().toISOString()
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error('Error initializing conversation:', error)
      setError('Failed to initialize conversation')
    }
  }

  const handleMessageSent = async (messageData) => {
    // Add user message to chat
    setMessages(prev => [...prev, messageData])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/patient-assist/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: messageData.content,
          conversationId: conversationId,
          language: i18n.language,
          context: {
            portal: 'wellness',
            userProfile: user?.profile || {}
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add AI response to chat
        const aiMessage = {
          id: data.messageId || Date.now(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          metadata: data.metadata
        }
        
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Failed to get AI response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to get response. Please try again.')
      
      // Add error message
      const errorMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: i18n.language === 'ar' 
          ? 'عذراً، حدث خطأ في الحصول على الرد. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error getting a response. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <MessageCircle className="h-8 w-8 mr-3 text-blue-600" />
          {t('aiMedicalChat')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {i18n.language === 'ar' 
            ? 'تحدث مع المساعد الطبي الذكي للحصول على إرشادات صحية فورية ومخصصة'
            : 'Chat with our AI medical assistant for instant, personalized health guidance'
          }
        </p>
      </div>

      {/* Medical Disclaimer */}
      <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-400">
          <strong>
            {i18n.language === 'ar' ? 'تنبيه طبي مهم:' : 'Important Medical Notice:'}
          </strong>{' '}
          {i18n.language === 'ar' 
            ? 'هذا المساعد الذكي يقدم معلومات عامة فقط ولا يغني عن استشارة طبيب مختص. في حالات الطوارئ، اتصل بالرقم 123 فوراً.'
            : 'This AI assistant provides general information only and does not replace professional medical consultation. In emergencies, call 123 immediately.'
          }
        </AlertDescription>
      </Alert>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Bot className="h-5 w-5 mr-2 text-green-600" />
            {i18n.language === 'ar' ? 'المساعد الطبي الذكي' : 'AI Medical Assistant'}
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">
                {i18n.language === 'ar' ? 'متصل' : 'Online'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <AudioChat
            conversationId={conversationId}
            onMessageSent={handleMessageSent}
            messages={messages}
            isLoading={isLoading}
            language={i18n.language}
          />
        </CardContent>
      </Card>

      {/* Features Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {i18n.language === 'ar' ? 'محادثة نصية' : 'Text Chat'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {i18n.language === 'ar' 
                ? 'اكتب أسئلتك واحصل على إجابات فورية'
                : 'Type your questions and get instant answers'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Bot className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {i18n.language === 'ar' ? 'ردود صوتية' : 'Voice Responses'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {i18n.language === 'ar' 
                ? 'استمع للردود بصوت ذكوري أو أنثوي'
                : 'Listen to responses with male or female voice'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {i18n.language === 'ar' ? 'تسجيل صوتي' : 'Voice Recording'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {i18n.language === 'ar' 
                ? 'سجل أسئلتك صوتياً بدلاً من الكتابة'
                : 'Record your questions instead of typing'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChatPage

