export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">PeptideScience</h3>
            <p className="text-gray-600 text-sm">
              Premium research peptides for scientific study.
              Laboratory-grade compounds with third-party verification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">All Peptides</a></li>
              <li><a href="#" className="hover:text-blue-600">BPC-157</a></li>
              <li><a href="#" className="hover:text-blue-600">TB-500</a></li>
              <li><a href="#" className="hover:text-blue-600">CJC-1295</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Terms</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-600">Disclaimer</a></li>
              <li className="text-red-600 font-medium">*For research only</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 PeptideScience. All rights reserved.</p>
          <p className="mt-1">Not for human consumption. Research chemicals only.</p>
        </div>
      </div>
    </footer>
  );
}