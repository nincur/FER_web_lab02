import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const settings = await prisma.vulnerabilityToggle.findFirst()

    return NextResponse.json({
      messages,
      xssVulnerable: settings?.xssVulnerable ?? true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, author } = body

    if (!content || !author) {
      return NextResponse.json(
        { error: 'Content and author are required' },
        { status: 400 }
      )
    }

    const settings = await prisma.vulnerabilityToggle.findFirst()
    const isXssVulnerable = settings?.xssVulnerable ?? true

    // Sanitize content if XSS protection is enabled
    let sanitizedContent = content
    if (!isXssVulnerable) {
      // Simple sanitization: escape HTML entities
      sanitizedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    const message = await prisma.message.create({
      data: {
        content: sanitizedContent,
        author,
      },
    })

    return NextResponse.json({
      message,
      sanitized: !isXssVulnerable,
      vulnerability: isXssVulnerable
        ? 'XSS VULNERABLE: Message stored without sanitization'
        : 'XSS PROTECTED: Message was sanitized before storage',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}

// DELETE all messages (for testing)
export async function DELETE() {
  try {
    await prisma.message.deleteMany()
    return NextResponse.json({ message: 'All messages deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete messages' },
      { status: 500 }
    )
  }
}
