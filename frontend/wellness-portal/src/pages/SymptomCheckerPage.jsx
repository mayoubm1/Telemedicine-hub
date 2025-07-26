import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Heart,
  Thermometer,
  Brain,
  Stethoscope
} from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const SymptomCheckerPage = () => {
  const { t } = useTranslation()
  const [symptoms, setSymptoms] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return

    setLoading(true)
    
    // Simulate AI analysis (replace with actual API call)
    setTimeout(() => {
      const mockAnalysis = {
        urgencyLevel: 'medium',
        possibleConditions: [
          { name: 'Common Cold', likelihood: 'High', description: 'Viral infection of the upper respiratory tract' },
          { name: 'Allergic Rhinitis', likelihood: 'Medium', description: 'Allergic reaction causing nasal symptoms' },
          { name: 'Sinusitis', likelihood: 'Low', description: 'Inflammation of the sinus cavities' }
        ],
        recommendations: [
          'Get plenty of rest and stay hydrated',
          'Consider over-the-counter pain relievers if needed',
          'Monitor symptoms for worsening',
          'Consult a healthcare provider if symptoms persist beyond 7-10 days'
        ],
        redFlags: [
          'Difficulty breathing or shortness of breath',
          'High fever (over 39°C/102°F)',
          'Severe headache or neck stiffness',
          'Persistent vomiting'
        ]
      }
      setAnalysis(mockAnalysis)
      setLoading(false)
    }, 3000)
  }

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-4 w-4" />
      case 'medium':
        return <Clock className="h-4 w-4" />
      case 'high':
        return <AlertTriangle className="h-4 w-4" />
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getLikelihoodColor = (likelihood) => {
    switch (likelihood.toLowerCase()) {
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

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Sore throat', 'Runny nose',
    'Fatigue', 'Nausea', 'Stomach pain', 'Dizziness', 'Muscle aches'
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('symptomCheckerTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Describe your symptoms to get AI-powered health insights
        </p>
      </div>

      {/* Disclaimer */}
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This tool is for informational purposes only and does not replace professional medical advice. 
          For emergencies, call 123 immediately.
        </AlertDescription>
      </Alert>

      {/* Symptom Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
            {t('describeSymptoms')}
          </CardTitle>
          <CardDescription>
            Describe your symptoms in detail, including when they started and how severe they are
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: I have been experiencing a headache for 2 days, along with a runny nose and mild fever..."
            className="min-h-[120px]"
          />
          
          {/* Common Symptoms */}
          <div>
            <p className="text-sm font-medium mb-2">Common symptoms (click to add):</p>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => {
                    const newSymptoms = symptoms ? `${symptoms}, ${symptom.toLowerCase()}` : symptom.toLowerCase()
                    setSymptoms(newSymptoms)
                  }}
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={!symptoms.trim() || loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing symptoms...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                {t('analyzeSymptoms')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Urgency Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getUrgencyIcon(analysis.urgencyLevel)}
                <span className="ml-2">{t('urgencyLevel')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${getUrgencyColor(analysis.urgencyLevel)} text-lg px-4 py-2`}>
                {analysis.urgencyLevel.charAt(0).toUpperCase() + analysis.urgencyLevel.slice(1)}
              </Badge>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Based on your symptoms, this appears to be a {analysis.urgencyLevel} priority situation.
              </p>
            </CardContent>
          </Card>

          {/* Possible Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                Possible Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.possibleConditions.map((condition, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{condition.name}</h3>
                      <Badge className={getLikelihoodColor(condition.likelihood)}>
                        {condition.likelihood} likelihood
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {condition.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                {t('recommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Red Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Seek Immediate Medical Attention If:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">What would you like to do next?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Save to Records
                  </Button>
                  <Button>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Chat with AI Assistant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SymptomCheckerPage

