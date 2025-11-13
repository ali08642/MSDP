"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, Shield, Zap, Users, TrendingUp, AlertCircle } from "lucide-react"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Forecasting",
      description: "Advanced LSTM and ARIMAX models predict disease spread 7-14 days in advance",
    },
    {
      icon: BarChart3,
      title: "Multi-Source Analytics",
      description: "Integrates lab data, pharmacy sales, weather, and search trends for accurate predictions",
    },
    {
      icon: AlertCircle,
      title: "Smart Alerts",
      description: "Automated risk-based notifications with 5-level severity escalation system",
    },
    {
      icon: Shield,
      title: "Privacy Assured",
      description: "HIPAA-compliant data handling with role-based access control and audit logs",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Tailored interfaces for admins, health officials, pharmacists, and lab technicians",
    },
    {
      icon: Zap,
      title: "Resource Optimizer",
      description: "Estimates bed requirements, staffing, and medical supplies with scenario planning",
    },
  ]

  const diseases = ["Malaria", "Dengue", "COVID-19", "Pneumonia", "Diarrhea"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">MSDP</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-emerald-100 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              Proactive Disease Surveillance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Predict Disease Outbreaks Before They Spread
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              ML-Based Disease Spread Predictor empowers health authorities with data-driven forecasts, early warnings,
              and resource planning tools for proactive public health response in Lahore and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start Forecasting
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-2xl blur-2xl" />
            <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="space-y-4">
                <div className="h-32 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-lg flex items-end justify-between p-4">
                  <div className="text-center">
                    <div className="w-2 h-16 bg-primary rounded-full" />
                    <p className="text-xs text-slate-600 mt-2">Mon</p>
                  </div>
                  <div className="text-center">
                    <div className="w-2 h-12 bg-primary/60 rounded-full" />
                    <p className="text-xs text-slate-600 mt-2">Tue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-2 h-20 bg-primary rounded-full" />
                    <p className="text-xs text-slate-600 mt-2">Wed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-2 h-24 bg-primary rounded-full" />
                    <p className="text-xs text-slate-600 mt-2">Thu</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dengue Risk</p>
                    <p className="text-xs text-slate-500">Forecasted Cases</p>
                  </div>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diseases Coverage */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground mb-12">Diseases Monitored</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {diseases.map((disease, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
              >
                <p className="font-semibold text-foreground">{disease}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Powerful Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-8 rounded-xl border-2 transition-all cursor-pointer ${
                  hoveredFeature === idx
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-slate-200 bg-white hover:border-primary/50"
                }`}
              >
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Data Intake", desc: "Labs, pharmacies upload daily data" },
              { num: "2", title: "Process", desc: "Clean, normalize, and align data" },
              { num: "3", title: "Predict", desc: "ML models forecast outbreaks" },
              { num: "4", title: "Act", desc: "Officials receive alerts and insights" },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-slate-300 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border-2 border-primary/30 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Protect Your Community?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join health authorities across Lahore using MSDP for proactive disease surveillance and rapid response.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors text-lg"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg" />
                <span className="font-bold text-white">MSDP</span>
              </div>
              <p className="text-sm">ML-Based Disease Spread Predictor</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-sm text-center">
            <p>&copy; 2025 MSDP. Proactive disease surveillance for public health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
