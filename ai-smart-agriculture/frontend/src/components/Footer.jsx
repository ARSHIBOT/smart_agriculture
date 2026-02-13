import { Leaf, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-6 h-6 text-primary-400" />
              <span className="text-lg font-bold">Smart Agriculture</span>
            </div>
            <p className="text-gray-300 text-sm">
              AI-powered platform helping farmers make data-driven decisions
              for better crop management and increased productivity.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Crop Disease Detection</li>
              <li>• Soil Analysis & Recommendations</li>
              <li>• Weather-based Farming Advice</li>
              <li>• Prediction History Dashboard</li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Technology</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• React & Tailwind CSS</li>
              <li>• FastAPI Backend</li>
              <li>• Machine Learning Models</li>
              <li>• Fully Offline Capable</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Smart Agriculture Assistant. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@smartagri.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
