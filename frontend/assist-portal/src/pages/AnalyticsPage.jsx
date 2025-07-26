import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users,
  Brain,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Award
} from 'lucide-react'

const AnalyticsPage = () => {
  const { t } = useTranslation()

  const performanceMetrics = [
    {
      title: 'Diagnostic Accuracy',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      description: 'AI-assisted diagnosis accuracy',
      icon: Brain,
      color: 'text-green-600'
    },
    {
      title: 'Response Time',
      value: '2.3 min',
      change: '-0.5 min',
      trend: 'up',
      description: 'Average AI response time',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Patient Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      description: 'Patient feedback rating',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Cases Handled',
      value: '156',
      change: '+23',
      trend: 'up',
      description: 'Total cases this month',
      icon: Activity,
      color: 'text-orange-600'
    }
  ]

  const aiMetrics = [
    {
      category: 'Differential Diagnosis',
      accuracy: 95,
      cases: 47,
      avgConfidence: 92,
      improvement: '+3%'
    },
    {
      category: 'Patient Responses',
      accuracy: 88,
      cases: 89,
      avgConfidence: 85,
      improvement: '+7%'
    },
    {
      category: 'Protocol Recommendations',
      accuracy: 97,
      cases: 34,
      avgConfidence: 94,
      improvement: '+1%'
    },
    {
      category: 'Research Queries',
      accuracy: 91,
      cases: 67,
      avgConfidence: 89,
      improvement: '+5%'
    }
  ]

  const patientEngagement = [
    {
      metric: 'Active Patients',
      current: 234,
      previous: 198,
      change: '+18%'
    },
    {
      metric: 'Daily Queries',
      current: 45,
      previous: 38,
      change: '+18%'
    },
    {
      metric: 'Follow-up Rate',
      current: 76,
      previous: 71,
      change: '+7%'
    },
    {
      metric: 'Satisfaction Score',
      current: 4.8,
      previous: 4.6,
      change: '+4%'
    }
  ]

  const clinicalOutcomes = [
    {
      outcome: 'Early Diagnosis',
      percentage: 87,
      cases: 134,
      description: 'Cases with early detection'
    },
    {
      outcome: 'Treatment Adherence',
      percentage: 92,
      cases: 178,
      description: 'Patients following recommendations'
    },
    {
      outcome: 'Symptom Improvement',
      percentage: 84,
      cases: 156,
      description: 'Patients reporting improvement'
    },
    {
      outcome: 'Preventive Care',
      percentage: 79,
      cases: 123,
      description: 'Preventive measures adopted'
    }
  ]

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    )
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 80) return 'bg-blue-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('analyticsTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Clinical performance analytics and insights
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="ai-performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-performance">AI Performance</TabsTrigger>
          <TabsTrigger value="patient-engagement">Patient Engagement</TabsTrigger>
          <TabsTrigger value="clinical-outcomes">Clinical Outcomes</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-performance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  AI System Performance
                </CardTitle>
                <CardDescription>
                  Detailed analytics on AI-assisted clinical functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {metric.category}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600 font-medium">
                            {metric.improvement}
                          </span>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Accuracy</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(metric.accuracy)}`}
                                style={{ width: `${metric.accuracy}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{metric.accuracy}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cases</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {metric.cases}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Confidence</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {metric.avgConfidence}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patient-engagement">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Patient Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientEngagement.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.metric}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">vs last month</p>
                        <p className="text-sm font-medium text-green-600">{item.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-orange-600" />
                  Response Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</span>
                    <span className="font-semibold">2.3 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
                    <span className="font-semibold text-blue-600">4.8/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Follow-up Required</span>
                    <span className="font-semibold text-yellow-600">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinical-outcomes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Clinical Outcomes & Impact
              </CardTitle>
              <CardDescription>
                Measuring the impact of AI-assisted healthcare delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clinicalOutcomes.map((outcome, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {outcome.outcome}
                      </h3>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {outcome.percentage}%
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getProgressColor(outcome.percentage)}`}
                          style={{ width: `${outcome.percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {outcome.description}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {outcome.cases} cases
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Key Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Improved Diagnostic Speed
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI-assisted diagnosis is 40% faster than traditional methods
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Higher Patient Engagement
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        24/7 AI support increased patient interaction by 65%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Complex Cases Need Review
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        15% of cases require human physician oversight
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-400">
                      95% Diagnostic Accuracy
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Exceeded target of 90% accuracy
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-medium text-blue-800 dark:text-blue-400">
                      500+ Patients Served
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Milestone reached this quarter
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="font-medium text-purple-800 dark:text-purple-400">
                      4.8/5 Satisfaction Score
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Highest rating in platform history
                    </p>
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

export default AnalyticsPage

