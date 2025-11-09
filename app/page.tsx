'use client'

import XSSDemo from '@/components/XSSDemo'
import SensitiveDataDemo from '@/components/SensitiveDataDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <XSSDemo />
          <SensitiveDataDemo />
        </div>

        <footer className="mt-16 text-center">
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm px-6 py-4 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-sm">
              Web Application Security Course - Lab 2
            </p>
            <p className="text-slate-400 text-xs mt-1">
              XSS & Sensitive Data Exposure Demo
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
