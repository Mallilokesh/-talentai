import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Briefcase, Users, Brain, TrendingUp, Search, Zap, Star, Shield } from 'lucide-react'

const stats = [
  { num: '48,200+', label: 'Active job listings' },
  { num: '12,500+', label: 'Companies hiring' },
  { num: '94%', label: 'Match accuracy' },
  { num: '2.4M+', label: 'Registered candidates' },
]

const categories = [
  { icon: '💻', name: 'Engineering', count: '18,400' },
  { icon: '📊', name: 'Finance', count: '6,200' },
  { icon: '🏥', name: 'Healthcare', count: '9,100' },
  { icon: '🎨', name: 'Design', count: '4,300' },
  { icon: '📣', name: 'Marketing', count: '5,600' },
  { icon: '🏗️', name: 'Operations', count: '7,800' },
]

const features = [
  { icon: Brain, title: 'AI Match Engine', desc: 'Scores every job against your profile with up to 98% accuracy using skill, experience, and culture fit analysis.' },
  { icon: Zap, title: 'Instant Shortlisting', desc: 'Employers get AI-ranked candidates in seconds — no manual screening needed.' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'Real-time insights on salary benchmarks, trending skills, and hiring patterns.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data is never sold. Control exactly who sees your profile.' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-brand-600 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 text-white/80 text-xs font-medium px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
              AI-Powered Job Matching
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Find your perfect career match — intelligently
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Our AI engine analyzes your skills, experience, and goals to recommend roles with pinpoint accuracy — for both job seekers and hiring teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs" className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center">
                <Search size={18} /> Find AI-matched jobs
              </Link>
              <Link href="/employer" className="border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 justify-center">
                <Briefcase size={18} /> I'm hiring
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100 py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-brand-600">{s.num}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-2">Browse by category</h2>
            <p className="text-gray-500 text-center text-sm mb-8">AI-matched roles across every industry</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(c => (
                <Link key={c.name} href={`/jobs?category=${c.name}`}
                  className="card text-center hover:border-brand-600 hover:shadow-md transition-all cursor-pointer group p-4">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="text-sm font-medium group-hover:text-brand-600">{c.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{c.count} jobs</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-2">Why TalentAI?</h2>
            <p className="text-gray-500 text-center text-sm mb-10">Built different — with real AI at the core</p>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map(f => (
                <div key={f.title} className="card flex gap-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <f.icon size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{f.title}</div>
                    <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-brand-600 text-white text-center">
          <div className="max-w-xl mx-auto">
            <Star size={32} className="mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-semibold mb-3">Ready to find your next role?</h2>
            <p className="text-white/80 mb-6 text-sm">Join over 2.4 million professionals using TalentAI to accelerate their careers.</p>
            <Link href="/jobs" className="bg-white text-brand-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              <Users size={18} /> Get started free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
