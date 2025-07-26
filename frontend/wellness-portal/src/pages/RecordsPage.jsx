import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Calendar, User, Activity, Download } from 'lucide-react'

const RecordsPage = () => {
  const { t } = useTranslation()
  const [records] = useState([
    {
      id: 1,
      type: 'consultation',
      title: 'General Health Consultation',
      description: 'Discussed headache symptoms and stress management',
      date: '2024-01-15',
      doctor: 'AI Assistant',
      status: 'completed'
    },
    {
      id: 2,
      type: 'lab_result',
      title: 'Blood Test Results',
      description: 'Complete blood count and lipid profile',
      date: '2024-01-10',
      doctor: 'Dr. Ahmed Hassan',
      status: 'reviewed'
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Medication Prescription',
      description: 'Prescribed medication for blood pressure',
      date: '2024-01-08',
      doctor: 'Dr. Fatima Ali',
      status: 'active'
    },
    {
      id: 4,
      type: 'symptom_check',
      title: 'Symptom Assessment',
      description: 'Cold symptoms evaluation',
      date: '2024-01-05',
      doctor: 'AI Assistant',
      status: 'completed'
    }
  ])

  const getRecordIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <User className="h-4 w-4" />
      case 'lab_result':
        return <Activity className="h-4 w-4" />
      case 'prescription':
        return <FileText className="h-4 w-4" />
      case 'symptom_check':
        return <Activity className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'reviewed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRecordTypeLabel = (type) => {
    switch (type) {
      case 'consultation':
        return t('consultation')
      case 'lab_result':
        return t('labResult')
      case 'prescription':
        return t('prescription')
      case 'symptom_check':
        return 'Symptom Check'
      default:
        return type
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('medicalRecords')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your medical records
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('addRecord')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Consultations</p>
                <p className="text-2xl font-bold">
                  {records.filter(r => r.type === 'consultation').length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lab Results</p>
                <p className="text-2xl font-bold">
                  {records.filter(r => r.type === 'lab_result').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prescriptions</p>
                <p className="text-2xl font-bold">
                  {records.filter(r => r.type === 'prescription').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {records.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    {getRecordIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {record.title}
                      </h3>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                      <Badge variant="outline">
                        {getRecordTypeLabel(record.type)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {record.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {record.doctor}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {records.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No medical records yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start by adding your first medical record or having a consultation with our AI assistant.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              {t('addRecord')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RecordsPage

