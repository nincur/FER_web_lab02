'use client'

import XSSDemo from '@/components/XSSDemo'
import SensitiveDataDemo from '@/components/SensitiveDataDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Web Security Vulnerabilities Demo
          </h1>
        </header>

        <div className="space-y-8">
          <XSSDemo />
          <SensitiveDataDemo />
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Created for Web Application Security Course - Lab 2
          </p>
          <p className="mt-2">
            Implemented vulnerabilities: Stored XSS & Sensitive Data Exposure
          </p>
        </footer>
      </div>
    </main>
  )
}
