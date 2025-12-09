import { Shield, Beaker, FileText, CheckCircle, Award, Clock } from 'lucide-react';

export const metadata = {
  title: 'Quality Assurance | EU-GMP Pharmaceutical Standards',
  description: 'EU-GMP manufacturing, triple-quadrupole LC-MS/MS validation, and pharmaceutical-grade quality control.',
};

export default function QualityPage() {
  const standards = [
    {
      icon: '🏭',
      title: 'EU-GMP Manufacturing',
      description: 'Produced in Poland under European Union Good Manufacturing Practice regulations for active pharmaceutical ingredients (APIs).',
      details: ['FDA-inspected facility', 'ISO 9001:2015 certified', 'EU Manufacturer License']
    },
    {
      icon: '🔬',
      title: 'Analytical Validation Suite',
      description: 'Comprehensive testing using state-of-the-art instrumentation for complete characterization.',
      details: ['Triple-quadrupole LC-MS/MS', 'High-resolution HPLC', 'Amino acid analysis', 'Chiral purity verification']
    },
    {
      icon: '📊',
      title: 'Batch Documentation',
      description: 'Complete Certificate of Analysis (CoA) with chromatograms and analytical data for each batch.',
      details: ['HPLC chromatograms', 'Mass spectra', 'Purity certificates', 'Stability data']
    },
    {
      icon: '⚖️',
      title: 'Regulatory Compliance',
      description: 'Full documentation package for regulatory submissions (EMA/FDA).',
      details: ['CMC documentation', 'ICH Q7 compliant', 'Stability per ICH guidelines', 'Impurity profiling']
    },
    {
      icon: '🧪',
      title: 'Third-Party Verification',
      description: 'Independent laboratory verification of identity, purity, and concentration.',
      details: ['ISO 17025 accredited labs', 'Method validation', 'Cross-laboratory testing', 'Reference standards']
    },
    {
      icon: '📦',
      title: 'Cold Chain Integrity',
      description: 'Temperature-controlled shipping and storage to maintain peptide stability.',
      details: ['Real-time monitoring', 'Validated packaging', '-20°C transport', 'Quality upon receipt']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Pharmaceutical Grade</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Pharmaceutical
              <span className="block text-blue-200">Quality Standards</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Every peptide batch undergoes rigorous EU-GMP manufacturing and comprehensive analytical validation 
              with full regulatory documentation for research and development.
            </p>
          </div>
        </div>
      </div>

      {/* Quality Standards Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standards.map((standard, index) => (
            <div key={index} className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {standard.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors">
                {standard.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {standard.description}
              </p>
              
              <ul className="space-y-3">
                {standard.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Badges */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Regulatory Certifications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our manufacturing facility maintains compliance with international regulatory standards
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'EU-GMP', desc: 'Good Manufacturing Practice' },
              { name: 'ISO 9001', desc: 'Quality Management' },
              { name: 'ICH Q7', desc: 'API Standards' },
              { name: 'FDA 21 CFR', desc: 'US Regulations' },
            ].map((cert, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-3xl mb-3">🏅</div>
                <h3 className="font-bold text-lg text-blue-900 mb-1">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CoA Example */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-6">
                Certificate of Analysis Example
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Each batch includes a detailed CoA with HPLC chromatograms, mass spectra, 
                and analytical data from third-party verification.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>HPLC purity ≥99% chromatogram</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>LC-MS/MS identity confirmation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Amino acid analysis verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Residual solvent testing</span>
                </li>
              </ul>
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                <FileText className="h-5 w-5" />
                Request Sample CoA
              </button>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">📄</div>
                  <div className="text-sm text-gray-400">Document ID: COA-2024-001</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Batch:</span>
                    <span className="font-mono">TZ-2024-08-001</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Purity:</span>
                    <span className="text-green-400 font-bold">99.2%</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Test Date:</span>
                    <span>2024-08-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lab:</span>
                    <span>ISO 17025 Accredited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}