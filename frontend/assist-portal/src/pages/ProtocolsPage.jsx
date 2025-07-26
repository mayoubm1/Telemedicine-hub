import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Search, 
  Download, 
  Calendar, 
  Tag,
  Star,
  Filter,
  BookOpen,
  Shield,
  AlertTriangle
} from 'lucide-react'

const ProtocolsPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Protocols', count: 156 },
    { id: 'cardiology', name: 'Cardiology', count: 23 },
    { id: 'emergency', name: 'Emergency Medicine', count: 34 },
    { id: 'internal', name: 'Internal Medicine', count: 28 },
    { id: 'surgery', name: 'Surgery', count: 19 },
    { id: 'pediatrics', name: 'Pediatrics', count: 15 },
    { id: 'infectious', name: 'Infectious Diseases', count: 12 },
    { id: 'neurology', name: 'Neurology', count: 11 },
    { id: 'oncology', name: 'Oncology', count: 14 }
  ]

  const protocols = [
    {
      id: 1,
      title: 'Acute Coronary Syndrome Management Protocol',
      category: 'cardiology',
      specialty: 'Cardiology',
      description: 'Evidence-based protocol for the diagnosis and management of acute coronary syndrome in emergency and inpatient settings.',
      lastUpdated: '2024-01-15',
      version: '3.2',
      evidenceLevel: 'Level I',
      pages: 24,
      downloads: 1247,
      rating: 4.8,
      tags: ['ACS', 'STEMI', 'NSTEMI', 'Emergency'],
      urgency: 'high',
      compliance: 'mandatory'
    },
    {
      id: 2,
      title: 'Sepsis Recognition and Management Guidelines',
      category: 'emergency',
      specialty: 'Emergency Medicine',
      description: 'Comprehensive guidelines for early recognition, diagnosis, and treatment of sepsis and septic shock.',
      lastUpdated: '2024-01-10',
      version: '2.1',
      evidenceLevel: 'Level I',
      pages: 18,
      downloads: 892,
      rating: 4.9,
      tags: ['Sepsis', 'Septic Shock', 'qSOFA', 'Antibiotics'],
      urgency: 'high',
      compliance: 'mandatory'
    },
    {
      id: 3,
      title: 'Diabetes Management in Hospitalized Patients',
      category: 'internal',
      specialty: 'Internal Medicine',
      description: 'Protocol for glucose management in hospitalized patients with diabetes mellitus.',
      lastUpdated: '2023-12-20',
      version: '1.8',
      evidenceLevel: 'Level II',
      pages: 16,
      downloads: 634,
      rating: 4.6,
      tags: ['Diabetes', 'Glucose Control', 'Insulin', 'Inpatient'],
      urgency: 'medium',
      compliance: 'recommended'
    },
    {
      id: 4,
      title: 'Pediatric Fever Management Protocol',
      category: 'pediatrics',
      specialty: 'Pediatrics',
      description: 'Age-specific guidelines for evaluation and management of fever in pediatric patients.',
      lastUpdated: '2024-01-05',
      version: '2.3',
      evidenceLevel: 'Level I',
      pages: 12,
      downloads: 456,
      rating: 4.7,
      tags: ['Pediatric', 'Fever', 'Antipyretics', 'Evaluation'],
      urgency: 'medium',
      compliance: 'recommended'
    },
    {
      id: 5,
      title: 'Stroke Thrombolysis Protocol',
      category: 'neurology',
      specialty: 'Neurology',
      description: 'Time-sensitive protocol for acute stroke evaluation and thrombolytic therapy administration.',
      lastUpdated: '2024-01-12',
      version: '4.1',
      evidenceLevel: 'Level I',
      pages: 20,
      downloads: 723,
      rating: 4.9,
      tags: ['Stroke', 'Thrombolysis', 'tPA', 'Time-sensitive'],
      urgency: 'high',
      compliance: 'mandatory'
    }
  ]

  const recentUpdates = [
    {
      title: 'Updated ACS Management Guidelines',
      date: '2024-01-15',
      changes: 'New recommendations for dual antiplatelet therapy duration'
    },
    {
      title: 'COVID-19 Treatment Protocol Revision',
      date: '2024-01-12',
      changes: 'Updated antiviral therapy recommendations'
    },
    {
      title: 'Antibiotic Stewardship Guidelines',
      date: '2024-01-08',
      changes: 'New resistance patterns and treatment modifications'
    }
  ]

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
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

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'mandatory':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'recommended':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'optional':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getEvidenceLevelColor = (level) => {
    switch (level) {
      case 'Level I':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Level II':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Level III':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredProtocols = protocols.filter(protocol => {
    const matchesCategory = selectedCategory === 'all' || protocol.category === selectedCategory
    const matchesSearch = protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('protocolsTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Access evidence-based clinical protocols and guidelines
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            {t('searchProtocols')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocols, conditions, or procedures..."
              className="flex-1"
            />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="protocols" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="protocols">Clinical Protocols</TabsTrigger>
          <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="protocols">
          <div className="space-y-4">
            {filteredProtocols.map((protocol) => (
              <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {protocol.title}
                        </h3>
                        {protocol.urgency === 'high' && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {protocol.specialty}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Updated {protocol.lastUpdated}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {protocol.pages} pages
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {protocol.downloads} downloads
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <Badge className={getEvidenceLevelColor(protocol.evidenceLevel)}>
                          {protocol.evidenceLevel}
                        </Badge>
                        <Badge className={getComplianceColor(protocol.compliance)}>
                          {protocol.compliance}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                        {protocol.rating}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {protocol.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {protocol.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Version {protocol.version}</span>
                      <div className="flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Verified by Medical Board</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="updates">
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {update.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {update.changes}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {update.date}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <Card className="text-center py-12">
            <CardContent>
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No favorite protocols yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Star protocols to add them to your favorites for quick access
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProtocolsPage

