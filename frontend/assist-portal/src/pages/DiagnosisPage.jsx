import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Stethoscope, 
  Activity, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Download,
  Share
} from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const DiagnosisPage = () => {
  const { t } = useTranslation()
  const [caseData, setCaseData] = useState({
    patientPresentation: '',
    clinicalFindings: '',
    diagnosticTests: '',
    patientAge: '',
    patientGender: '',
    chiefComplaint: ''
  })
  const [diagnosis, setDiagnosis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setCaseData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateDiagnosis = async () => {
    if (!caseData.patientPresentation.trim()) return

    setLoading(true)
    
    // Simulate AI diagnosis generation (replace with actual API call)
    setTimeout(() => {
      const mockDiagnosis = {
        differentialDiagnoses: [
          {
            condition: 'Acute Myocardial Infarction',
            confidence: 85,
            icdCode: 'I21.9',
            reasoning: 'Chest pain, elevated cardiac enzymes, ECG changes consistent with STEMI',
            urgency: 'emergency',
            recommendations: [
              'Immediate cardiac catheterization',
              'Dual antiplatelet therapy',
              'Beta-blocker therapy',
              'ACE inhibitor'
            ]
          },
          {
            condition: 'Unstable Angina',
            confidence: 72,
            icdCode: 'I20.0',
            reasoning: 'Chest pain pattern, risk factors, but normal initial cardiac enzymes',
            urgency: 'high',
            recommendations: [
              'Serial cardiac enzymes',
              'Stress testing',
              'Antiplatelet therapy',
              'Risk stratification'
            ]
          },
          {
            condition: 'Gastroesophageal Reflux Disease',
            confidence: 45,
            icdCode: 'K21.9',
            reasoning: 'Chest pain can mimic cardiac symptoms, especially if related to meals',
            urgency: 'low',
            recommendations: [
              'PPI trial',
              'Dietary modifications',
              'Rule out cardiac causes first',
              'Consider endoscopy if symptoms persist'
            ]
          }
        ],
        clinicalPearls: [
          'Always rule out life-threatening causes of chest pain first',
          'Serial ECGs and cardiac enzymes are crucial',
          'Consider atypical presentations in elderly and diabetic patients'
        ],
        nextSteps: [
          'Immediate ECG and cardiac enzymes',
          'Chest X-ray',
          'Complete blood count',
          'Basic metabolic panel'
        ],
        redFlags: [
          'Hemodynamic instability',
          'New heart murmur',
          'Radiation to jaw or left arm',
          'Diaphoresis with chest pain'
        ]
      }
      setDiagnosis(mockDiagnosis)
      setLoading(false)
    }, 3000)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('differentialDiagnosis')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered differential diagnosis with evidence-based recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                {t('enterCaseDetails')}
              </CardTitle>
              <CardDescription>
                Provide detailed clinical information for accurate diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Patient Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={caseData.patientAge}
                    onChange={(e) => handleInputChange('patientAge', e.target.value)}
                    placeholder="65"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={caseData.patientGender}
                    onChange={(e) => handleInputChange('patientGender', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Input
                  id="chiefComplaint"
                  value={caseData.chiefComplaint}
                  onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                  placeholder="Chest pain for 2 hours"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presentation">{t('patientPresentation')}</Label>
                <Textarea
                  id="presentation"
                  value={caseData.patientPresentation}
                  onChange={(e) => handleInputChange('patientPresentation', e.target.value)}
                  placeholder="65-year-old male presents with acute onset chest pain, described as crushing, radiating to left arm, associated with diaphoresis and nausea..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="findings">{t('clinicalFindings')}</Label>
                <Textarea
                  id="findings"
                  value={caseData.clinicalFindings}
                  onChange={(e) => handleInputChange('clinicalFindings', e.target.value)}
                  placeholder="Vital signs: BP 140/90, HR 95, RR 18, O2 sat 98%. Physical exam: S1S2 regular, no murmurs, lungs clear..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tests">{t('diagnosticTests')}</Label>
                <Textarea
                  id="tests"
                  value={caseData.diagnosticTests}
                  onChange={(e) => handleInputChange('diagnosticTests', e.target.value)}
                  placeholder="ECG: ST elevation in leads II, III, aVF. Troponin I: 2.5 ng/mL (elevated)..."
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleGenerateDiagnosis}
                disabled={!caseData.patientPresentation.trim() || loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Analyzing case...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    {t('generateDiagnosis')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {diagnosis ? (
            <Tabs defaultValue="diagnoses" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                <TabsTrigger value="recommendations">Next Steps</TabsTrigger>
                <TabsTrigger value="pearls">Clinical Pearls</TabsTrigger>
              </TabsList>

              <TabsContent value="diagnoses">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-green-600" />
                        Differential Diagnoses
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {diagnosis.differentialDiagnoses.map((dx, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{dx.condition}</h3>
                            <div className="flex space-x-2">
                              <Badge className={getUrgencyColor(dx.urgency)}>
                                {dx.urgency}
                              </Badge>
                              <Badge className={getConfidenceColor(dx.confidence)}>
                                {dx.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <Progress value={dx.confidence} className="h-2" />
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              <strong>ICD-10:</strong> {dx.icdCode}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {dx.reasoning}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Recommendations:</h4>
                            <ul className="text-sm space-y-1">
                              {dx.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="h-3 w-3 text-green-600 mt-1 mr-2 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Immediate Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {diagnosis.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                        Red Flags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {diagnosis.redFlags.map((flag, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pearls">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Clinical Pearls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnosis.clinicalPearls.map((pearl, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full mr-3 mt-1">
                            <FileText className="h-3 w-3 text-purple-600" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{pearl}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready for AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter case details to generate differential diagnosis with confidence scoring
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiagnosisPage

