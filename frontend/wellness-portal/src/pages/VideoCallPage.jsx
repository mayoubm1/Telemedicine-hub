import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Video, 
  Calendar, 
  Clock, 
  User,
  Phone,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'
import VideoCall from '../components/VideoCall'

const VideoCallPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [roomId, setRoomId] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [appointmentInfo, setAppointmentInfo] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if joining from a scheduled appointment
    const appointmentId = searchParams.get('appointment')
    const roomFromUrl = searchParams.get('room')
    const doctorId = searchParams.get('doctor')

    if (roomFromUrl) {
      setRoomId(roomFromUrl)
    }

    if (appointmentId) {
      // Fetch appointment details (mock data for now)
      setAppointmentInfo({
        id: appointmentId,
        scheduledTime: new Date(),
        duration: 30,
        type: 'consultation'
      })
    }

    if (doctorId) {
      // Fetch doctor details (mock data for now)
      setDoctorInfo({
        id: doctorId,
        name: 'Ahmed Hassan',
        specialization: 'Internal Medicine',
        email: 'dr.hassan@telemedicine.com',
        avatar: null
      })
    }
  }, [searchParams])

  const generateRoomId = () => {
    const newRoomId = `telemedicine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setRoomId(newRoomId)
    return newRoomId
  }

  const joinCall = () => {
    if (!roomId) {
      generateRoomId()
    }
    setIsInCall(true)
  }

  const endCall = () => {
    setIsInCall(false)
    navigate('/dashboard')
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy room ID:', err)
    }
  }

  const shareRoomLink = () => {
    const link = `${window.location.origin}/video-call?room=${roomId}`
    if (navigator.share) {
      navigator.share({
        title: 'Join Video Consultation',
        text: 'Join me for a video consultation',
        url: link
      })
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isInCall) {
    return (
      <VideoCall 
        roomId={roomId}
        onEndCall={endCall}
        doctorInfo={doctorInfo}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('videoConsultation')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with healthcare professionals through secure video calls
        </p>
      </div>

      {/* Appointment Info */}
      {appointmentInfo && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-400">
              <Calendar className="h-5 w-5 mr-2" />
              Scheduled Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  {appointmentInfo.scheduledTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  {doctorInfo ? `Dr. ${doctorInfo.name}` : 'Healthcare Professional'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  {appointmentInfo.duration} minutes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Join Call Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-green-600" />
              Join Video Call
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID or generate new one"
                  className="flex-1"
                />
                <Button
                  onClick={copyRoomId}
                  variant="outline"
                  size="sm"
                  disabled={!roomId}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={generateRoomId} variant="outline" className="flex-1">
                Generate Room ID
              </Button>
              <Button onClick={shareRoomLink} variant="outline" disabled={!roomId}>
                Share Link
              </Button>
            </div>

            <Button 
              onClick={joinCall} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!roomId}
            >
              <Video className="h-4 w-4 mr-2" />
              Join Call
            </Button>

            {roomId && (
              <Alert>
                <AlertDescription>
                  Share this Room ID with your healthcare provider: <strong>{roomId}</strong>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Before You Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Check Your Connection
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Ensure you have a stable internet connection
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Test Camera & Microphone
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Allow browser access to camera and microphone
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Find a Quiet Space
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Choose a well-lit, quiet location for your consultation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Prepare Your Information
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Have your medical history and current symptoms ready
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Requirements */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Technical Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Supported Browsers
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Chrome (recommended)</li>
                <li>• Firefox</li>
                <li>• Safari</li>
                <li>• Edge</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Minimum Requirements
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Stable internet connection (1 Mbps+)</li>
                <li>• Working camera and microphone</li>
                <li>• Updated browser</li>
                <li>• Allow camera/microphone permissions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Notice */}
      <Alert className="mt-6 border-red-200 bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-400">
          <strong>Emergency Notice:</strong> If this is a medical emergency, please call 123 immediately instead of using video consultation.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default VideoCallPage

