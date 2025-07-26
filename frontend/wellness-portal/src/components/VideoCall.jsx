import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  Settings,
  Monitor,
  MessageCircle
} from 'lucide-react'

const VideoCall = ({ roomId, onEndCall, doctorInfo = null }) => {
  const { t } = useTranslation()
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState(1)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const jitsiContainerRef = useRef(null)
  const jitsiApi = useRef(null)

  useEffect(() => {
    // Initialize Jitsi Meet
    const initializeJitsi = () => {
      if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
        const domain = 'meet.jit.si' // Free Jitsi server
        const options = {
          roomName: roomId || `telemedicine-${Date.now()}`,
          width: '100%',
          height: 400,
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            startScreenSharing: false,
            enableEmailInStats: false
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
            ],
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            SHOW_CHROME_EXTENSION_BANNER: false
          },
          userInfo: {
            displayName: doctorInfo ? `Dr. ${doctorInfo.name}` : 'Patient',
            email: doctorInfo?.email || 'patient@telemedicine.com'
          }
        }

        jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options)

        // Event listeners
        jitsiApi.current.addEventListener('videoConferenceJoined', () => {
          setIsConnected(true)
          console.log('Video conference joined')
        })

        jitsiApi.current.addEventListener('videoConferenceLeft', () => {
          setIsConnected(false)
          if (onEndCall) onEndCall()
          console.log('Video conference left')
        })

        jitsiApi.current.addEventListener('participantJoined', () => {
          setParticipants(prev => prev + 1)
        })

        jitsiApi.current.addEventListener('participantLeft', () => {
          setParticipants(prev => Math.max(1, prev - 1))
        })

        jitsiApi.current.addEventListener('audioMuteStatusChanged', ({ muted }) => {
          setIsAudioEnabled(!muted)
        })

        jitsiApi.current.addEventListener('videoMuteStatusChanged', ({ muted }) => {
          setIsVideoEnabled(!muted)
        })
      }
    }

    // Load Jitsi Meet API script
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = initializeJitsi
      document.head.appendChild(script)
    } else {
      initializeJitsi()
    }

    // Cleanup
    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose()
      }
    }
  }, [roomId, doctorInfo, onEndCall])

  // Timer for call duration
  useEffect(() => {
    let interval
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleAudio = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand('toggleAudio')
    }
  }

  const toggleVideo = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand('toggleVideo')
    }
  }

  const endCall = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand('hangup')
    }
  }

  const toggleChat = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand('toggleChat')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('videoConsultation')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {doctorInfo ? `Consultation with Dr. ${doctorInfo.name}` : 'Video consultation session'}
        </p>
      </div>

      {/* Call Status Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-600' : 'text-yellow-600'}`}>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-600' : 'bg-yellow-600'} animate-pulse`} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              
              {isConnected && (
                <>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{participants} participant{participants > 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span className="text-sm">Duration: {formatDuration(callDuration)}</span>
                  </div>
                </>
              )}
            </div>

            {doctorInfo && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Dr. {doctorInfo.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {doctorInfo.specialization}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {doctorInfo.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Container */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div 
            ref={jitsiContainerRef}
            className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Call Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={toggleAudio}
              variant={isAudioEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-12 h-12"
            >
              {isAudioEnabled ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={toggleVideo}
              variant={isVideoEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-12 h-12"
            >
              {isVideoEnabled ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={toggleChat}
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <Button
              onClick={endCall}
              variant="destructive"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Room ID: <span className="font-mono font-medium">{roomId}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Share this room ID with your doctor to join the consultation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Notice */}
      <Card className="mt-6 border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-400">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">
              Emergency: If this is a medical emergency, please call 123 immediately
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VideoCall

