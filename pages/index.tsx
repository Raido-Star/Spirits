import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, SparklesIcon, CpuChipIcon, GlobeAltIcon, ShieldCheckIcon, LightningBoltIcon, CodeIcon, MusicalNoteIcon, PaintBrushIcon, CogIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <CpuChipIcon className="h-8 w-8 text-blue-500" />,
      title: 'Multi-Model AI Agents',
      description: 'Deploy agents powered by GPT-4, Claude, Gemini, and more. Switch between models seamlessly.',
    },
    {
      icon: <CodeIcon className="h-8 w-8 text-green-500" />,
      title: 'Code Generation',
      description: 'Build full-stack applications, APIs, and websites with AI-powered code generation.',
    },
    {
      icon: <MusicalNoteIcon className="h-8 w-8 text-purple-500" />,
      title: 'Music Creation',
      description: 'Compose melodies, generate lyrics, and create full musical arrangements.',
    },
    {
      icon: <PaintBrushIcon className="h-8 w-8 text-pink-500" />,
      title: 'Creative Assets',
      description: 'Generate images, videos, logos, and creative content for any project.',
    },
    {
      icon: <CogIcon className="h-8 w-8 text-orange-500" />,
      title: 'Workflow Automation',
      description: 'Create complex workflows that connect multiple AI agents and tools.',
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-red-500" />,
      title: 'Enterprise Security',
      description: 'Built-in security, compliance, and governance for enterprise deployments.',
    },
  ];

  const stats = [
    { label: 'AI Models Supported', value: '50+' },
    { label: 'Tools & Integrations', value: '200+' },
    { label: 'Active Users', value: '10K+' },
    { label: 'Projects Created', value: '25K+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Nexus AI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-white/80 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-white/80 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#docs" className="text-white/80 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/auth/login" className="text-white/80 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Ultimate
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}AI Agent{' '}
              </span>
              Platform
            </h1>
            <p className="text-xl lg:text-2xl text-white/80 mb-8 leading-relaxed">
              Build applications, games, music, websites, and more with the most powerful AI agent framework. 
              Production-ready, secure, and infinitely scalable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                Start Building Free
              </Link>
              <Link href="#demo" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all border border-white/20">
                Watch Demo
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything You Need to Build with AI
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              From idea to production, Nexus AI provides all the tools and infrastructure you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Watch how easy it is to create, deploy, and manage AI agents with Nexus AI.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/20">
            <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4 inline-block">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white text-lg">Platform Demo Video</p>
                <p className="text-white/60">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and businesses using Nexus AI to create the next generation of AI-powered applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
              Get Started Free
            </Link>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all border border-white/20">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Nexus AI</span>
              </div>
              <p className="text-white/60">
                The ultimate AI agent platform for building the future.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Nexus AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;