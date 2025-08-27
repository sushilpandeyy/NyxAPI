import React, { useState } from 'react';
import { Rocket, Clock, Zap, Database, Menu, X, ArrowRight, Check } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navbar */}
      <nav className="fixed w-full bg-dark-900/95 backdrop-blur-md z-50 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="heading-4">
              Nyx<span className="text-primary-500">API</span>
            </a>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it Works</NavLink>
              <NavLink href="#demo">Demo</NavLink>
              <a href="/login">
                <button className="btn-primary">
                  Get Started
                </button>
              </a>
            </div>

            <button 
              className="md:hidden btn-ghost p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark-900 border-t border-dark-800">
            <div className="flex flex-col space-y-2 px-4 py-4">
              <NavLink href="#features" mobile>Features</NavLink>
              <NavLink href="#how-it-works" mobile>How it Works</NavLink>
              <NavLink href="#demo" mobile>Demo</NavLink>
              <a href="/login" className="pt-4">
                <button className="btn-primary w-full">
                  Get Started
                </button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-transparent to-dark-950"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary-900/30 rounded-full mb-6 animate-pulse-slow">
            <Rocket className="w-8 h-8 text-primary-400" />
          </div>
          
          <h1 className="heading-1 mb-6 animate-fade-in">
            Build APIs at <span className="text-primary-400">Lightning Speed</span>
          </h1>
          
          <p className="text-body text-xl mb-10 max-w-3xl mx-auto animate-slide-in">
            Generate, deploy, and manage mock APIs in minutes. Perfect for hackathons, prototypes, and rapid development.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a href="/login">
              <button className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Start Building <ArrowRight size={20} />
              </button>
            </a>
            <a href="#demo">
              <button className="btn-secondary text-lg px-8 py-4">
                View Demo
              </button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">60s</div>
              <div className="text-muted">Deploy Time</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <div className="text-muted">Endpoints</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-muted">Setup Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Why Choose NyxAPI?</h2>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Everything you need to prototype and test your frontend applications with realistic APIs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="w-8 h-8 text-primary-400" />}
              title="Deploy in 60 Seconds"
              description="Create and deploy your first API endpoint instantly. No complex configuration or setup required."
            />
            <FeatureCard 
              icon={<Database className="w-8 h-8 text-primary-400" />}
              title="Custom Response Data"
              description="Design RESTful endpoints with custom JSON responses, headers, and status codes."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-primary-400" />}
              title="Real-time Updates"
              description="Modify your API responses instantly. Changes reflect immediately without redeployment."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Three Steps to Your First API</h2>
            <p className="text-body text-lg">Get up and running in minutes, not hours.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Step 
              number="1"
              title="Create Project"
              description="Set up your workspace and define your API project structure."
            />
            <Step 
              number="2"
              title="Design Endpoints"
              description="Create custom endpoints with your desired response format and data."
            />
            <Step 
              number="3"
              title="Start Testing"
              description="Use your live API endpoints immediately in your frontend applications."
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Simple & Powerful</h2>
            <p className="text-body text-lg">No complex setup. Just define your data and start building.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="heading-3 mb-6">Create APIs in Seconds</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-400" />
                  <span className="text-body">No backend knowledge required</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-400" />
                  <span className="text-body">Real-time collaborative editing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-400" />
                  <span className="text-body">Instant subdomain generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-400" />
                  <span className="text-body">Custom headers & status codes</span>
                </div>
              </div>
              
              <a href="/login">
                <button className="btn-primary flex items-center gap-2">
                  Try It Now <ArrowRight size={18} />
                </button>
              </a>
            </div>
            
            <div className="card bg-dark-800 border-dark-600">
              <div className="text-muted text-sm mb-4">Example API Response</div>
              <pre className="text-primary-300 text-sm leading-relaxed overflow-x-auto">
{`{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Jane Smith", 
      "email": "jane@example.com",
      "role": "user"
    }
  ],
  "total": 2,
  "status": "success"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="heading-4 mb-4">
                Nyx<span className="text-primary-500">API</span>
              </h3>
              <p className="text-body mb-6 max-w-md">
                Accelerating frontend development with powerful, easy-to-use mock APIs. 
                Perfect for prototypes, testing, and rapid development.
              </p>
              <div className="flex gap-4">
                <a href="/login" className="btn-primary">
                  Get Started
                </a>
                <a href="#demo" className="btn-ghost">
                  Learn More
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <FooterLinks links={['Features', 'API Documentation', 'Pricing', 'Examples']} />
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <FooterLinks links={['Help Center', 'Community', 'Status Page', 'Contact']} />
            </div>
          </div>
          
          <div className="pt-8 border-t border-dark-800 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-muted text-center sm:text-left mb-4 sm:mb-0">
              © 2025 NyxAPI. All rights reserved.
            </div>
            <div className="flex gap-6 text-muted">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Component definitions
const NavLink = ({ href, children, mobile = false }) => (
  <a 
    href={href} 
    className={mobile ? "btn-ghost text-left w-full" : "btn-ghost"}
  >
    {children}
  </a>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="card-hover group">
    <div className="mb-6 p-3 bg-primary-900/30 rounded-xl w-fit group-hover:bg-primary-900/50 transition-colors">
      {icon}
    </div>
    <h3 className="heading-4 mb-4">{title}</h3>
    <p className="text-body">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
      <span className="text-xl font-bold text-white">{number}</span>
    </div>
    <h3 className="heading-4 mb-4">{title}</h3>
    <p className="text-body">{description}</p>
  </div>
);

const FooterLinks = ({ links }) => (
  <ul className="space-y-3">
    {links.map(link => (
      <li key={link}>
        <a href="#" className="text-dark-300 hover:text-white transition-colors">
          {link}
        </a>
      </li>
    ))}
  </ul>
);

export default HomePage;