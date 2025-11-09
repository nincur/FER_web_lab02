import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET current vulnerability settings
export async function GET() {
  try {
    const settings = await prisma.vulnerabilityToggle.findFirst()

    if (!settings) {
      // Create default settings if none exist
      const newSettings = await prisma.vulnerabilityToggle.create({
        data: {
          xssVulnerable: true,
          sensitiveDataVulnerable: true,
        },
      })
      return NextResponse.json(newSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST update vulnerability settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { xssVulnerable, sensitiveDataVulnerable } = body

    const settings = await prisma.vulnerabilityToggle.findFirst()

    if (!settings) {
      const newSettings = await prisma.vulnerabilityToggle.create({
        data: {
          xssVulnerable: xssVulnerable ?? true,
          sensitiveDataVulnerable: sensitiveDataVulnerable ?? true,
        },
      })
      return NextResponse.json(newSettings)
    }

    const updated = await prisma.vulnerabilityToggle.update({
      where: { id: settings.id },
      data: {
        xssVulnerable: xssVulnerable ?? settings.xssVulnerable,
        sensitiveDataVulnerable: sensitiveDataVulnerable ?? settings.sensitiveDataVulnerable,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
