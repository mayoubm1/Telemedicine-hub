import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle, 
  Activity, 
  FileText, 
  User, 
  Heart,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowRight
} from 'lucide-react'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const quickActions = [
    {
      icon: MessageCircle,
      title: t('startChat'),
      description: 'Get instant health advice from our AI assistant',
      href: '/chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Activity,
      title: t('checkSymptoms'),
      description: 'Analyze your symptoms and get recommendations',
      href: '/symptom-checker',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: t('viewRecords'),
      description: 'Access and manage your medical records',
      href: '/records',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: User,
      title: t('updateProfile'),
      description: 'Update your personal and medical information',
      href: '/profile',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const recentActivity = [
    {
      type: 'chat',
      title: 'AI Consultation',
      description: 'Discussed headache symptoms',
      time: '2 hours ago',
      icon: MessageCircle
    },
    {
      type: 'symptom',
      title: 'Symptom Check',
      description: 'Checked cold symptoms',
      time: '1 day ago',
      icon: Activity
    },
    {
      type: 'record',
      title: 'Medical Record',
      description: 'Added lab results',
      time: '3 days ago',
      icon: FileText
    }
  ]

  const healthStats = [
    {
      title: 'Health Score',
      value: '85%',
      description: 'Based on your recent activities',
      icon: Heart,
      color: 'text-green-600'
    },
    {
      title: 'Last Check-up',
      value: '2 weeks ago',
      description: 'Regular health monitoring',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Improvement',
      value: '+12%',
      description: 'Health trend this month',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('welcome')}, {user?.profile?.firstName || user?.email}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('dashboardWelcome')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {healthStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link to={action.href}>
                  <CardHeader>
                    <div className={`mx-auto bg-gradient-to-r ${action.color} p-3 rounded-full w-fit group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-center">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{action.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('recentActivity')}
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tips */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Health Tips
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                Daily Health Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Stay hydrated! Drinking adequate water helps maintain your body's functions and can improve your overall health.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/chat">
                  Ask AI for more tips
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Emergency Services</span>
                  <span className="font-medium">123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Poison Control</span>
                  <span className="font-medium">16000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Health Hotline</span>
                  <span className="font-medium">105</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

