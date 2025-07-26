import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Users, 
  ExternalLink,
  Download,
  Star,
  Filter,
  TrendingUp
} from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ResearchPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock research data
  const recentFindings = [
    {
      id: 1,
      title: 'Novel Biomarkers for Early Detection of Acute Myocardial Infarction',
      authors: 'Smith J, Johnson A, Williams B',
      journal: 'Journal of Cardiology',
      year: 2024,
      citations: 45,
      evidenceLevel: 'Level I',
      abstract: 'This study identifies novel biomarkers that can detect acute myocardial infarction 2 hours earlier than traditional troponin assays...',
      keywords: ['biomarkers', 'myocardial infarction', 'early detection'],
      doi: '10.1016/j.jacc.2024.01.001'
    },
    {
      id: 2,
      title: 'AI-Assisted Diagnosis in Emergency Medicine: A Systematic Review',
      authors: 'Chen L, Rodriguez M, Patel S',
      journal: 'Emergency Medicine Review',
      year: 2024,
      citations: 78,
      evidenceLevel: 'Level I',
      abstract: 'Systematic review of 150 studies examining the effectiveness of AI-assisted diagnosis in emergency departments...',
      keywords: ['artificial intelligence', 'emergency medicine', 'diagnosis'],
      doi: '10.1016/j.emr.2024.02.003'
    },
    {
      id: 3,
      title: 'Telemedicine Outcomes in Rural Healthcare Settings',
      authors: 'Ahmed H, Hassan F, Ibrahim M',
      journal: 'Rural Health Journal',
      year: 2024,
      citations: 23,
      evidenceLevel: 'Level II',
      abstract: 'Analysis of telemedicine implementation in rural Egyptian healthcare facilities and patient outcomes...',
      keywords: ['telemedicine', 'rural healthcare', 'Egypt'],
      doi: '10.1016/j.rhj.2024.01.015'
    }
  ]

  const trendingTopics = [
    { topic: 'AI in Medical Diagnosis', papers: 1247, growth: '+15%' },
    { topic: 'Telemedicine', papers: 892, growth: '+23%' },
    { topic: 'Precision Medicine', papers: 756, growth: '+8%' },
    { topic: 'Digital Health', papers: 634, growth: '+19%' },
    { topic: 'Machine Learning', papers: 523, growth: '+12%' }
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    
    // Simulate API search (replace with actual PubMed/medical database API)
    setTimeout(() => {
      const mockResults = [
        {
          id: 4,
          title: `${searchQuery}: Recent Advances and Clinical Applications`,
          authors: 'Multiple Authors',
          journal: 'Medical Research Today',
          year: 2024,
          citations: 67,
          evidenceLevel: 'Level I',
          abstract: `Comprehensive review of recent advances in ${searchQuery} and their clinical applications in modern medicine...`,
          keywords: [searchQuery.toLowerCase(), 'clinical applications', 'recent advances'],
          doi: '10.1016/j.mrt.2024.03.001',
          relevanceScore: 95
        },
        {
          id: 5,
          title: `Clinical Guidelines for ${searchQuery} Management`,
          authors: 'Expert Panel',
          journal: 'Clinical Guidelines Review',
          year: 2023,
          citations: 134,
          evidenceLevel: 'Level I',
          abstract: `Evidence-based clinical guidelines for the management of ${searchQuery} in various clinical settings...`,
          keywords: [searchQuery.toLowerCase(), 'clinical guidelines', 'management'],
          doi: '10.1016/j.cgr.2023.12.005',
          relevanceScore: 88
        }
      ]
      setSearchResults(mockResults)
      setLoading(false)
    }, 2000)
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('medicalResearchTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Access 22+ million medical articles and latest research findings
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            {t('searchQuery')}
          </CardTitle>
          <CardDescription>
            Search medical literature, clinical trials, and research papers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., acute myocardial infarction, diabetes management, AI diagnosis"
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">{t('recentFindings')}</TabsTrigger>
          <TabsTrigger value="results">Search Results</TabsTrigger>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <div className="space-y-4">
            {recentFindings.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {paper.authors}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {paper.journal}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {paper.year}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getEvidenceLevelColor(paper.evidenceLevel)}>
                        {paper.evidenceLevel}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 mr-1" />
                        {paper.citations} citations
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {paper.abstract}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {paper.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500">DOI: {paper.doi}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Found {searchResults.length} results for "{searchQuery}"
              </div>
              {searchResults.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {paper.title}
                          </h3>
                          {paper.relevanceScore && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {paper.relevanceScore}% match
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {paper.authors}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {paper.journal}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {paper.year}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getEvidenceLevelColor(paper.evidenceLevel)}>
                          {paper.evidenceLevel}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-3 w-3 mr-1" />
                          {paper.citations} citations
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {paper.abstract}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {paper.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500">DOI: {paper.doi}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No search results yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter a search query to find relevant medical literature
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {topic.topic}
                    </h3>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{topic.growth}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {topic.papers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    papers published this year
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResearchPage

