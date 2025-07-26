import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Stethoscope, 
  Brain, 
  Search, 
  FileText, 
  Users,
  BarChart3,
  Shield,
  Globe,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Microscope,
  BookOpen,
  Activity
} from 'lucide-react'

const HomePage = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Brain,
      title: t('aiDiagnosis'),
      description: t('aiDiagnosisDesc')
    },
    {
      icon: Search,
      title: t('medicalResearch'),
      description: t('medicalResearchDesc')
    },
    {
      icon: FileText,
      title: t('clinicalProtocols'),
      description: t('clinicalProtocolsDesc')
    },
    {
      icon: Users,
      title: t('patientManagement'),
      description: t('patientManagementDesc')
    }
  ]

  const clinicalTools = [
    {
      icon: Brain,
      title: t('differentialDiagnosis'),
      description: 'AI-powered differential diagnosis with confidence scoring',
      href: '/diagnosis',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Microscope,
      title: t('medicalResearch'),
      description: 'Access 22+ million medical articles and research',
      href: '/research',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: t('protocols'),
      description: 'Clinical protocols and evidence-based guidelines',
      href: '/protocols',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Activity,
      title: t('analytics'),
      description: 'Clinical performance analytics and insights',
      href: '/analytics',
      color: 'from-orange-500 to-orange-600',
      auth: true
    }
  ]

  const benefits = [
    'Evidence-based clinical decision support',
    'Real-time access to medical literature',
    'Standardized clinical protocols',
    'Secure patient data management',
    'Continuous medical education',
    'Performance analytics and insights'
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full mb-6">
              <Stethoscope className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/dashboard">
                  {t('dashboard')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/register">
                  {t('getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link to="/research">{t('learnMore')}</Link>
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
            Advanced clinical intelligence tools designed for healthcare professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-full w-fit">
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

      {/* Clinical Tools Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Clinical Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful tools to enhance your clinical practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicalTools.map((tool, index) => {
            if (tool.auth && !isAuthenticated) return null
            const Icon = tool.icon
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <Link to={tool.href}>
                  <CardHeader>
                    <div className={`mx-auto bg-gradient-to-r ${tool.color} p-4 rounded-full w-fit group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{tool.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose My-AssisstAi?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Empowering healthcare professionals with AI-driven insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Supporting clinical excellence across Egypt and beyond
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">22M+</div>
            <div className="text-gray-600 dark:text-gray-300">Medical Articles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-300">Clinical Protocols</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-300">Diagnostic Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">AI Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Enhance Your Clinical Practice?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join healthcare professionals who trust My-AssisstAi for clinical decision support
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
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

