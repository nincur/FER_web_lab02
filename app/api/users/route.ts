import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

// GET all users with sensitive data handling
export async function GET() {
  try {
    const settings = await prisma.vulnerabilityToggle.findFirst()
    const isSensitiveDataVulnerable = settings?.sensitiveDataVulnerable ?? true

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // If not vulnerable, exclude sensitive data from response
    const sanitizedUsers = users.map((user) => {
      if (isSensitiveDataVulnerable) {
        // VULNERABLE: Return all data including plaintext passwords
        return user
      } else {
        // SECURE: Exclude password and API key from response
        const { password, apiKey, ...safeUser } = user
        return {
          ...safeUser,
          password: '***HIDDEN***',
          apiKey: apiKey ? '***HIDDEN***' : null,
        }
      }
    })

    return NextResponse.json({
      users: sanitizedUsers,
      sensitiveDataVulnerable: isSensitiveDataVulnerable,
      warning: isSensitiveDataVulnerable
        ? 'VULNERABLE: Passwords and API keys are exposed in plaintext!'
        : 'SECURE: Sensitive data is hidden from API responses',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, role, apiKey } = body

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    const settings = await prisma.vulnerabilityToggle.findFirst()
    const isSensitiveDataVulnerable = settings?.sensitiveDataVulnerable ?? true

    // Hash password if secure mode is enabled
    let storedPassword = password
    if (!isSensitiveDataVulnerable) {
      // SECURE: Hash the password
      const saltRounds = 10
      storedPassword = await bcrypt.hash(password, saltRounds)
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: storedPassword,
        role: role || 'user',
        apiKey,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      vulnerability: isSensitiveDataVulnerable
        ? 'VULNERABLE: Password stored in plaintext!'
        : 'SECURE: Password was hashed using bcrypt',
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PUT update existing users to hash their passwords
export async function PUT() {
  try {
    const users = await prisma.user.findMany()
    const saltRounds = 10

    for (const user of users) {
      // Only hash if it's not already hashed (bcrypt hashes start with $2b$)
      if (!user.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        })
      }
    }

    return NextResponse.json({
      message: 'All user passwords have been hashed',
      count: users.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to hash passwords' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to reset users to plaintext passwords (for demo purposes)
export async function DELETE() {
  try {
    // Reset to original plaintext passwords
    await prisma.user.updateMany({
      where: { username: 'admin' },
      data: { password: 'Admin123!' },
    })
    await prisma.user.updateMany({
      where: { username: 'user1' },
      data: { password: 'Password123' },
    })
    await prisma.user.updateMany({
      where: { username: 'john_doe' },
      data: { password: 'john1234' },
    })

    return NextResponse.json({
      message: 'User passwords reset to plaintext for demo purposes',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reset passwords' },
      { status: 500 }
    )
  }
}
