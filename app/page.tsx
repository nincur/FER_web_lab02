'use client'

import XSSDemo from '@/components/XSSDemo'
import SensitiveDataDemo from '@/components/SensitiveDataDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h1 className="text-3xl font-bold text-white">
                Security Lab
              </h1>
            </div>
          </div>
          <p className="text-purple-200 text-lg font-medium">
            Web Vulnerability Testing Environment
          </p>
        </header>

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
