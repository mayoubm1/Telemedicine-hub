import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User, Heart, Settings, Save } from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    dateOfBirth: user?.profile?.dateOfBirth || '',
    gender: user?.profile?.gender || '',
    language: user?.preferences?.language || 'ar'
  })

  const [medicalInfo, setMedicalInfo] = useState({
    allergies: user?.medicalProfile?.allergies || [],
    chronicConditions: user?.medicalProfile?.chronicConditions || [],
    medications: user?.medicalProfile?.medications || [],
    emergencyContact: user?.medicalProfile?.emergencyContact || {
      name: '',
      phone: '',
      relationship: ''
    }
  })

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMedicalInfoChange = (field, value) => {
    setMedicalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmergencyContactChange = (field, value) => {
    setMedicalInfo(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const updateData = {
        profile: personalInfo,
        medicalProfile: medicalInfo,
        preferences: {
          language: personalInfo.language
        }
      }

      const result = await updateProfile(updateData)
      
      if (result.success) {
        setMessage(t('profileUpdated'))
      } else {
        setMessage(result.error || 'Update failed')
      }
    } catch (error) {
      setMessage('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('profile')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your personal and medical information
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') || message.includes(t('profileUpdated'))
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {t('personalInfo')}
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            {t('medicalInfo')}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            {t('preferences')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInfo')}</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('firstName')}</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('lastName')}</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t('dateOfBirth')}</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('gender')}</Label>
                <Select 
                  value={personalInfo.gender}
                  onValueChange={(value) => handlePersonalInfoChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('male')}</SelectItem>
                    <SelectItem value="female">{t('female')}</SelectItem>
                    <SelectItem value="other">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>{t('medicalInfo')}</CardTitle>
              <CardDescription>
                Manage your medical information for better AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">{t('allergies')}</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any allergies (e.g., penicillin, peanuts)"
                  value={medicalInfo.allergies.join(', ')}
                  onChange={(e) => handleMedicalInfoChange('allergies', e.target.value.split(', ').filter(Boolean))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronicConditions">{t('chronicConditions')}</Label>
                <Textarea
                  id="chronicConditions"
                  placeholder="List any chronic conditions (e.g., diabetes, hypertension)"
                  value={medicalInfo.chronicConditions.join(', ')}
                  onChange={(e) => handleMedicalInfoChange('chronicConditions', e.target.value.split(', ').filter(Boolean))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">{t('currentMedications')}</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications and dosages"
                  value={medicalInfo.medications.join(', ')}
                  onChange={(e) => handleMedicalInfoChange('medications', e.target.value.split(', ').filter(Boolean))}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">{t('emergencyContact')}</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={medicalInfo.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={medicalInfo.emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={medicalInfo.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t('preferences')}</CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={personalInfo.language}
                  onValueChange={(value) => handlePersonalInfoChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {t('loading')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t('save')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default ProfilePage

