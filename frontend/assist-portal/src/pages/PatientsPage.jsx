import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Search, 
  MessageCircle, 
  Calendar, 
  Activity,
  AlertCircle,
  Clock,
  CheckCircle,
  User,
  Phone,
  Mail,
  FileText,
  Brain
} from 'lucide-react'

const PatientsPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const patients = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      age: 45,
      gender: 'Male',
      phone: '+20 123 456 7890',
      email: 'ahmed.hassan@email.com',
      lastVisit: '2024-01-15',
      condition: 'Hypertension',
      status: 'active',
      priority: 'medium',
      aiResponses: 3,
      pendingQueries: 1,
      lastQuery: 'Medication side effects',
      queryTime: '2 hours ago'
    },
    {
      id: 2,
      name: 'Fatima Ali',
      age: 32,
      gender: 'Female',
      phone: '+20 123 456 7891',
      email: 'fatima.ali@email.com',
      lastVisit: '2024-01-12',
      condition: 'Diabetes Type 2',
      status: 'pending',
      priority: 'high',
      aiResponses: 5,
      pendingQueries: 2,
      lastQuery: 'Blood sugar management',
      queryTime: '30 minutes ago'
    },
    {
      id: 3,
      name: 'Mohamed Ibrahim',
      age: 28,
      gender: 'Male',
      phone: '+20 123 456 7892',
      email: 'mohamed.ibrahim@email.com',
      lastVisit: '2024-01-10',
      condition: 'Asthma',
      status: 'completed',
      priority: 'low',
      aiResponses: 2,
      pendingQueries: 0,
      lastQuery: 'Inhaler technique',
      queryTime: '1 day ago'
    },
    {
      id: 4,
      name: 'Nour Mahmoud',
      age: 55,
      gender: 'Female',
      phone: '+20 123 456 7893',
      email: 'nour.mahmoud@email.com',
      lastVisit: '2024-01-14',
      condition: 'Cardiac Arrhythmia',
      status: 'urgent',
      priority: 'high',
      aiResponses: 1,
      pendingQueries: 3,
      lastQuery: 'Chest pain symptoms',
      queryTime: '15 minutes ago'
    }
  ]

  const aiResponses = [
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      query: 'What are the side effects of my blood pressure medication?',
      aiResponse: 'Common side effects of ACE inhibitors include dry cough, dizziness, and fatigue. If you experience persistent cough or severe dizziness, please contact your healthcare provider.',
      timestamp: '2024-01-15 14:30',
      status: 'pending_review',
      confidence: 92,
      needsReview: true
    },
    {
      id: 2,
      patientName: 'Fatima Ali',
      query: 'My blood sugar is 180 mg/dL after meals. Is this normal?',
      aiResponse: 'Post-meal blood sugar of 180 mg/dL is above the recommended target of <140 mg/dL for diabetic patients. Consider reviewing your meal plan and medication timing with your healthcare provider.',
      timestamp: '2024-01-15 13:45',
      status: 'approved',
      confidence: 88,
      needsReview: false
    },
    {
      id: 3,
      patientName: 'Nour Mahmoud',
      query: 'I feel chest tightness and irregular heartbeat. Should I be worried?',
      aiResponse: 'Chest tightness with irregular heartbeat requires immediate medical attention. Please contact emergency services or visit the nearest emergency department immediately.',
      timestamp: '2024-01-15 15:45',
      status: 'urgent',
      confidence: 95,
      needsReview: true
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getResponseStatusColor = (status) => {
    switch (status) {
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const pendingReviews = aiResponses.filter(response => response.needsReview).length
  const urgentCases = patients.filter(patient => patient.status === 'urgent').length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('patientManagementTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage patient consultations and AI-assisted responses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReviews}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Urgent Cases</p>
                <p className="text-2xl font-bold text-red-600">{urgentCases}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Responses</p>
                <p className="text-2xl font-bold text-green-600">{aiResponses.length}</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patient List</TabsTrigger>
          <TabsTrigger value="ai-responses">AI Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients by name or condition..."
                  className="flex-1"
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="urgent">Urgent</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                        <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {patient.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>{patient.age} years, {patient.gender}</span>
                          <span>•</span>
                          <span>{patient.condition}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {patient.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Last visit: {patient.lastVisit}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                        <Badge className={getPriorityColor(patient.priority)}>
                          {patient.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800 dark:text-blue-400">AI Responses</span>
                        <span className="font-semibold text-blue-800 dark:text-blue-400">{patient.aiResponses}</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-800 dark:text-yellow-400">Pending Queries</span>
                        <span className="font-semibold text-yellow-800 dark:text-yellow-400">{patient.pendingQueries}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800 dark:text-green-400">Last Query</span>
                        <span className="text-xs text-green-800 dark:text-green-400">{patient.queryTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Latest Query:</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{patient.lastQuery}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Records
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat History
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Brain className="h-4 w-4 mr-1" />
                      Review AI Responses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-responses">
          <div className="space-y-4">
            {aiResponses.map((response) => (
              <Card key={response.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {response.patientName}
                        </h3>
                        <Badge className={getResponseStatusColor(response.status)}>
                          {response.status.replace('_', ' ')}
                        </Badge>
                        {response.needsReview && (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {response.timestamp} • Confidence: {response.confidence}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Query:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {response.query}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Response:</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {response.aiResponse}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    {response.needsReview && (
                      <>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Follow Up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Response Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</span>
                    <span className="font-semibold">2.3 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Confidence</span>
                    <span className="font-semibold">91.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
                    <span className="font-semibold text-blue-600">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Patients</span>
                    <span className="font-semibold">{patients.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Daily Queries</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Response Coverage</span>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Follow-up Rate</span>
                    <span className="font-semibold">76%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PatientsPage

