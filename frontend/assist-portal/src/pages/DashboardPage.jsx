import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  Search, 
  FileText, 
  Users,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  BarChart3,
  BookOpen,
  MessageCircle
} from 'lucide-react'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const quickActions = [
    {
      icon: Brain,
      title: t('startDiagnosis'),
      description: 'Generate differential diagnosis with AI assistance',
      href: '/diagnosis',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Search,
      title: t('searchResearch'),
      description: 'Access 22+ million medical articles and research',
      href: '/research',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: t('viewProtocols'),
      description: 'Browse clinical protocols and guidelines',
      href: '/protocols',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: t('managePatients'),
      description: 'Review patient cases and consultations',
      href: '/patients',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const recentActivity = [
    {
      type: 'diagnosis',
      title: 'Differential Diagnosis',
      description: 'Chest pain case - 3 differential diagnoses generated',
      time: '2 hours ago',
      icon: Brain,
      urgency: 'high'
    },
    {
      type: 'research',
      title: 'Research Query',
      description: 'Searched for "acute myocardial infarction treatment"',
      time: '4 hours ago',
      icon: Search,
      urgency: 'medium'
    },
    {
      type: 'protocol',
      title: 'Protocol Access',
      description: 'Viewed ACS management protocol',
      time: '1 day ago',
      icon: FileText,
      urgency: 'low'
    },
    {
      type: 'patient',
      title: 'Patient Consultation',
      description: 'Responded to patient query about medication',
      time: '2 days ago',
      icon: MessageCircle,
      urgency: 'medium'
    }
  ]

  const clinicalStats = [
    {
      title: 'Cases Analyzed',
      value: '47',
      description: 'This month',
      icon: Activity,
      color: 'text-blue-600',
      trend: '+12%'
    },
    {
      title: 'Diagnostic Accuracy',
      value: '94%',
      description: 'AI-assisted diagnoses',
      icon: Brain,
      color: 'text-green-600',
      trend: '+3%'
    },
    {
      title: 'Research Queries',
      value: '23',
      description: 'This week',
      icon: Search,
      color: 'text-purple-600',
      trend: '+8%'
    },
    {
      title: 'Patient Responses',
      value: '15',
      description: 'AI-assisted responses',
      icon: MessageCircle,
      color: 'text-orange-600',
      trend: '+25%'
    }
  ]

  const pendingTasks = [
    {
      title: 'Review AI Patient Responses',
      description: '3 AI responses to patient queries need review',
      priority: 'high',
      time: 'Due in 2 hours'
    },
    {
      title: 'Update Clinical Protocols',
      description: 'New cardiology guidelines available',
      priority: 'medium',
      time: 'Due tomorrow'
    },
    {
      title: 'Case Follow-up',
      description: '2 differential diagnosis cases need follow-up',
      priority: 'medium',
      time: 'Due in 3 days'
    }
  ]

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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('welcome')}, Dr. {user?.profile?.firstName || user?.email}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('dashboardWelcome')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.profile?.specialization && `${user.profile.specialization} • `}
              {user?.profile?.hospital || 'Healthcare Professional'}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full">
              <Stethoscope className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {clinicalStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                </div>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
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

        {/* Pending Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Pending Tasks
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{task.time}</span>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-600" />
            AI Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">Active</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Patient Response AI</div>
              <div className="text-xs text-gray-500">Responding to 15 patient queries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Diagnostic Accuracy</div>
              <div className="text-xs text-gray-500">Based on recent cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Availability</div>
              <div className="text-xs text-gray-500">Continuous patient support</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage

