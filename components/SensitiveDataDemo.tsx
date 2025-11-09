'use client'

import { useState, useEffect } from 'react'
import VulnerabilityToggle from './VulnerabilityToggle'

interface User {
  id: number
  username: string
  email: string
  password: string
  role: string
  apiKey: string | null
  createdAt: string
}

export default function SensitiveDataDemo() {
  const [users, setUsers] = useState<User[]>([])
  const [isVulnerable, setIsVulnerable] = useState(true)
  const [responseInfo, setResponseInfo] = useState('')
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    apiKey: '',
  })

  useEffect(() => {
    fetchUsers()
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const res = await fetch('/api/settings')
    const data = await res.json()
    setIsVulnerable(data.sensitiveDataVulnerable)
  }

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    setUsers(data.users)
    setResponseInfo(data.warning)
    setIsVulnerable(data.sensitiveDataVulnerable)
  }

  const handleToggle = async (enabled: boolean) => {
    setIsVulnerable(enabled)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensitiveDataVulnerable: enabled }),
    })

    if (!enabled) {
      // Hash existing passwords when switching to secure mode
      const hashRes = await fetch('/api/users', { method: 'PUT' })
      const hashData = await hashRes.json()
      setResponseInfo(
        `Switched to SECURE mode. ${hashData.message || 'Passwords are now hashed.'}`
      )
    } else {
      // Reset to plaintext when switching to vulnerable mode
      await fetch('/api/users', { method: 'DELETE' })
      setResponseInfo(
        'Switched to VULNERABLE mode. Passwords reset to plaintext for demo.'
      )
    }

    // Refresh user list
    setTimeout(fetchUsers, 500)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    const data = await res.json()

    if (res.ok) {
      setResponseInfo(data.vulnerability)
      setNewUser({ username: '', email: '', password: '', apiKey: '' })
      fetchUsers()
    } else {
      setResponseInfo(`Error: ${data.error}`)
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        2. Sensitive Data Exposure Demo
      </h2>

      <VulnerabilityToggle
        type="sensitiveData"
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
          Create New User
        </h3>
        <form onSubmit={handleCreateUser} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              placeholder="Username"
              className="p-2 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Email"
              className="p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Password"
            className="w-full p-2 bg-gray-700 text-white rounded"
            required
          />
          <input
            type="text"
            value={newUser.apiKey}
            onChange={(e) => setNewUser({ ...newUser, apiKey: e.target.value })}
            placeholder="API Key (optional)"
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create User
          </button>
        </form>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold text-white mb-3">
          User Database ({users.length} users)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">API Key</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="px-4 py-3 font-medium text-white">
                    {user.username}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td
                    className={`px-4 py-3 font-mono text-xs ${
                      isVulnerable ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {user.password}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {user.apiKey || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin'
                          ? 'bg-purple-900 text-purple-200'
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 bg-yellow-900 text-yellow-100 p-4 rounded">
        <h4 className="font-semibold mb-2">Attack Demonstration:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            When VULNERABLE: Passwords stored in plaintext, visible in database
            and API
          </li>
          <li>When SECURE: Passwords hashed with bcrypt, hidden from API</li>
          <li>
            VULNERABLE mode exposes: plaintext passwords, API keys, sensitive
            user data
          </li>
          <li>
            Real impact: Account takeover, credential stuffing, data breaches
          </li>
          <li>
            Compliance violations: GDPR, PCI-DSS, HIPAA all require secure data
            storage
          </li>
        </ul>
      </div>
    </div>
  )
}
