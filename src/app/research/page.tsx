import { BookOpen, FileText, Search, Download, Share2, Bookmark } from 'lucide-react';

export const metadata = {
  title: 'Research | Scientific Studies & Clinical Research',
  description: 'Scientific research, clinical studies, mechanism of action, and published literature on pharmaceutical peptides.',
};

export default function ResearchPage() {
  const researchCategories = [
    {
      category: 'GLP-1 Analogs',
      studies: [
        { title: 'Tirzepatide in Metabolic Syndrome', journal: 'Nature Medicine', year: 2023, pmid: '36720234' },
        { title: 'Semaglutide Cardiovascular Outcomes', journal: 'NEJM', year: 2022, pmid: '34914875' },
        { title: 'Dual GIP/GLP-1 Mechanism', journal: 'Cell Metabolism', year: 2023, pmid: '36803689' },
      ]
    },
    {
      category: 'Healing Peptides',
      studies: [
        { title: 'BPC-157 in Tissue Repair', journal: 'Journal of Orthopaedic Research', year: 2022, pmid: '35470987' },
        { title: 'TB-500 Angiogenesis Study', journal: 'Wound Repair and Regeneration', year: 2021, pmid: '34085765' },
        { title: 'Peptides in Tendon Healing', journal: 'American Journal of Sports Medicine', year: 2023, pmid: '36734321' },
      ]
    },
    {
      category: 'Cognitive Peptides',
      studies: [
        { title: 'Semax Neuroprotection', journal: 'Frontiers in Neuroscience', year: 2022, pmid: '35958987' },
        { title: 'Selank Anxiolytic Effects', journal: 'Psychopharmacology', year: 2021, pmid: '33939012' },
        { title: 'Nootropic Peptides Review', journal: 'Neuropharmacology', year: 2023, pmid: '36803690' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Scientific pattern */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dna-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* DNA helix pattern */}
                <path d="M50,20 C70,20 70,80 50,80 C30,80 30,20 50,20" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M45,25 L55,35 M45,35 L55,45 M45,45 L55,55 M45,55 L55,65 M45,65 L55,75" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dna-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Scientific Research</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Pharmaceutical Peptide
              <span className="block text-purple-200">Research Database</span>
            </h1>
            
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive scientific literature, clinical studies, and mechanism of action research 
              for pharmaceutical-grade peptides used in academic and clinical research.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search research by peptide, mechanism, or condition..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Categories */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Research Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse scientific literature categorized by peptide class and research area
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {researchCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <h3 className="text-xl font-bold">{category.category}</h3>
                <p className="text-indigo-200 text-sm mt-2">
                  {category.studies.length} studies
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {category.studies.map((study, studyIndex) => (
                    <div key={studyIndex} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <h4 className="font-bold text-gray-900 mb-2">{study.title}</h4>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span className="font-medium">{study.journal}</span>
                        <span>{study.year}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FileText className="h-3 w-3" />
                          <span>PMID: {study.pmid}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="text-indigo-600 hover:text-indigo-800 p-1">
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-800 p-1">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                  View All {category.category} Studies
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Research Resources */}
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Research Resources</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📚', title: 'Mechanism Guides', desc: 'Detailed mechanism of action explanations' },
              { icon: '🧬', title: 'Protocol Library', desc: 'Research protocols and methodologies' },
              { icon: '📊', title: 'Data Sheets', desc: 'Technical data and specifications' },
              { icon: '🎓', title: 'Academic Support', desc: 'Research collaboration inquiries' },
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-indigo-300 transition-colors">
                <div className="text-3xl mb-3">{resource.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Specific Research?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
            Our scientific team can provide literature reviews, mechanism explanations, 
            and research guidance for your specific project.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
            <Share2 className="h-5 w-5" />
            Contact Research Team
          </button>
        </div>
      </div>
    </div>
  );
}