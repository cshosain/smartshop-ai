import { Link } from 'react-router-dom';
import { FiGrid, FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiGrid className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              SmartShop<span className="text-accent-500">AI</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Intelligent e-commerce powered by machine learning.
            Personalized recommendations, sentiment analysis, and more.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/"         className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/login"    className="hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-white font-semibold mb-3">Built With</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'Redux', 'Node.js', 'MongoDB', 'Python', 'FastAPI', 'TailwindCSS'].map(tech => (
              <span key={tech} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md">
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <a href="https://github.com/cshosain" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <FiGithub className="text-xl" />
            </a>
            <a href="https://linkedin.com/in/cshosain" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <FiLinkedin className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
        <p>© {new Date().getFullYear()} SmartShopAI. Built as a portfolio project.</p>
      </div>
    </div>
  </footer>
);

export default Footer;