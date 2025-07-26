import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  Clock, 
  Shield, 
  Globe, 
  MessageCircle, 
  Activity, 
  FileText,
  Users,
  Stethoscope,
  Brain,
  ArrowRight
} from 'lucide-react'

const HomePage = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Brain,
      title: t('aiPowered'),
      description: t('aiPoweredDesc')
    },
    {
      icon: Clock,
      title: t('available247'),
      description: t('available247Desc')
    },
    {
      icon: Shield,
      title: t('securePrivate'),
      description: t('securePrivateDesc')
    },
    {
      icon: Globe,
      title: t('multiLanguage'),
      description: t('multiLanguageDesc')
    }
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: t('chat'),
      description: 'Start a conversation with our AI health assistant',
      href: '/chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Activity,
      title: t('symptomChecker'),
      description: 'Check your symptoms and get instant guidance',
      href: '/symptom-checker',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: t('records'),
      description: 'Manage your medical records securely',
      href: '/records',
      color: 'from-purple-500 to-purple-600',
      auth: true
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-full mb-6">
              <Heart className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Link to="/dashboard">
                  {t('dashboard')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Link to="/register">
                  {t('getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link to="/symptom-checker">{t('learnMore')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive healthcare support designed for everyone, everywhere
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 p-3 rounded-full w-fit">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('quickActions')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started with our most popular features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            if (action.auth && !isAuthenticated) return null
            const Icon = action.icon
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <Link to={action.href}>
                  <CardHeader>
                    <div className={`mx-auto bg-gradient-to-r ${action.color} p-4 rounded-full w-fit group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{action.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Communities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Making healthcare accessible across Egypt and beyond
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Available Support</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-300">Privacy Protected</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">2</div>
            <div className="text-gray-600 dark:text-gray-300">Languages Supported</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands who trust My-wellnessAi for their healthcare needs
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Link to="/register">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage

