'use client'

import { useState, useEffect } from 'react'
import VulnerabilityToggle from './VulnerabilityToggle'

interface Message {
  id: number
  content: string
  author: string
  createdAt: string
}

export default function XSSDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [author, setAuthor] = useState('TestUser')
  const [isVulnerable, setIsVulnerable] = useState(true)
  const [responseInfo, setResponseInfo] = useState('')

  useEffect(() => {
    fetchMessages()
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const res = await fetch('/api/settings')
    const data = await res.json()
    setIsVulnerable(data.xssVulnerable)
  }

  const fetchMessages = async () => {
    const res = await fetch('/api/messages')
    const data = await res.json()
    setMessages(data.messages)
    setIsVulnerable(data.xssVulnerable)
  }

  const handleToggle = async (enabled: boolean) => {
    setIsVulnerable(enabled)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xssVulnerable: enabled }),
    })
    setResponseInfo(
      enabled
        ? 'XSS vulnerability ENABLED - Messages will NOT be sanitized'
        : 'XSS vulnerability DISABLED - Messages will be sanitized'
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage, author }),
    })
    const data = await res.json()
    setResponseInfo(data.vulnerability)
    setNewMessage('')
    fetchMessages()
  }

  const clearMessages = async () => {
    await fetch('/api/messages', { method: 'DELETE' })
    fetchMessages()
    setResponseInfo('All messages cleared')
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        1. Cross-Site Scripting (XSS) - Stored XSS Demo
      </h2>

      <VulnerabilityToggle
        type="xss"
        onToggle={handleToggle}
        initialValue={isVulnerable}
      />

      {responseInfo && (
        <div
          className={`mt-4 p-3 rounded ${
            isVulnerable
              ? 'bg-red-900 text-red-100'
              : 'bg-green-900 text-green-100'
          }`}
        >
          {responseInfo}
        </div>
      )}

      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold text-white mb-3">
          Test XSS Attack
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Try posting a message with HTML event handlers. Examples:
          <code className="block bg-gray-700 p-2 mt-2 rounded text-yellow-300">
            {`<img src=x onerror="alert('XSS Attack!')">`}
          </code>
          <code className="block bg-gray-700 p-2 mt-2 rounded text-yellow-300">
            {`<svg onload="alert('SVG XSS!')">`}
          </code>
          <code className="block bg-gray-700 p-2 mt-2 rounded text-yellow-300">
            {`<body onload="alert('Body XSS!')">`}
          </code>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message (try injecting a script!)"
              className="w-full p-2 bg-gray-700 text-white rounded h-24"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Post Message
            </button>
            <button
              type="button"
              onClick={clearMessages}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Clear All Messages
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold text-white mb-3">
          Messages ({messages.length})
        </h3>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages yet. Post one above!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-blue-400">
                    {msg.author}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <div
                  className="text-white"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 bg-yellow-900 text-yellow-100 p-4 rounded">
        <h4 className="font-semibold mb-2">Attack Demonstration:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            When VULNERABLE: Scripts in messages will execute (alert boxes will
            appear)
          </li>
          <li>When SECURE: HTML is escaped and displayed as text</li>
          <li>
            This demonstrates Stored XSS - malicious code is saved in the
            database
          </li>
          <li>
            Real impact: Cookie theft, session hijacking, redirect to phishing
            sites
          </li>
        </ul>
      </div>
    </div>
  )
}
