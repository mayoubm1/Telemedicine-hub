import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">My-wellnessAi</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('heroSubtitle')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@my-wellnessai.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/symptom-checker" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('symptomChecker')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/chat" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('chat')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/records" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('records')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('copyright')}
          </p>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 md:mt-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>Egypt - Rural Healthcare Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

