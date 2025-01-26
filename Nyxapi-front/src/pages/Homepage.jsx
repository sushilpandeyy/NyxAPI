import React, { useState } from 'react';
import { Rocket, Clock, Users, Code, Zap, Database, Menu, X, Link } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navbar */}
      <nav className="fixed w-full bg-gray-900/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="text-2xl font-bold text-white">
              Nyx<span className="text-blue-500">API</span>
            </a>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#features">Docs</NavLink>
              <a href="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </button>
              </a>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 py-4">
            <div className="flex flex-col space-y-4 px-4">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="/login">Docs</NavLink>
              <Link href="/login"> 
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-block animate-bounce mb-4">
            <Rocket className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Build APIs at <span className="text-blue-500">Hackathon Speed</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Generate, deploy, and manage mock APIs in minutes. Perfect for hackathons, prototypes, and rapid development.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/login">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start Building
              </button>
            </a>
            <a href="/login">
              <button className="border border-gray-400 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                View Demo
              </button>
            </a>
          </div>
          
          <div className="mt-12 flex justify-center">
             
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle>Why Choose NyxAPI?</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon={<Clock className="w-8 h-8 text-blue-500" />}
            title="Ready in 60 Seconds"
            description="Create and deploy your first API endpoint in under a minute. Perfect for hackathon deadlines."
          />
          <FeatureCard 
            icon={<Database className="w-8 h-8 text-blue-500" />}
            title="Custom Endpoints"
            description="Design RESTful endpoints with custom response payloads, exactly how you need them."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-blue-500" />}
            title="Instant Updates"
            description="Modify your API responses in real-time. No rebuilding or redeploying needed."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Three Steps to Your First API</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Step 
              number="1"
              title="Create Organization"
              description="Set up your team workspace in seconds"
            />
            <Step 
              number="2"
              title="Define Endpoint"
              description="Specify your API routes and response structure"
            />
            <Step 
              number="3"
              title="Start Building"
              description="Use your live API endpoints immediately"
            />
          </div>
        </div>
      </div>

      {/* Code Demo Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>Simple to Use</SectionTitle>
          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Create an API in Three Lines
              </h3>
              <p className="text-gray-400 mb-6">
                No complex setup required. Just define your endpoint and response structure.
              </p>
              <a href="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Start Building
              </button>
              </a>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 font-mono text-sm">
              <pre className="text-gray-300">
{`
  [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">NyxAPI</h3>
              <p className="text-gray-400">
                Accelerating frontend development with powerful mock APIs.
              </p>
            </div>
            <div>
               
            </div>
            <div>
               
            </div>
            <div>
              
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            © 2025 NyxAPI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ href, children }) => (
  <a href={href} className="text-gray-300 hover:text-white transition">
    {children}
  </a>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-bold text-white text-center">
    {children}
  </h2>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-xl font-bold text-white">{number}</span>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Stat = ({ number, label }) => (
  <div className="text-center px-4">
    <div className="text-2xl font-bold text-white">{number}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

const FooterLinks = ({ links }) => (
  <ul className="space-y-2">
    {links.map(link => (
      <li key={link}>
        <a href="#" className="text-gray-400 hover:text-white transition">
          {link}
        </a>
      </li>
    ))}
  </ul>
);

export default HomePage;