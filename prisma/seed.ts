import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.user.deleteMany()
  await prisma.vulnerabilityToggle.deleteMany()

  // Create vulnerability toggle settings (default: vulnerable)
  await prisma.vulnerabilityToggle.create({
    data: {
      xssVulnerable: true,
      sensitiveDataVulnerable: true,
    },
  })

  // Create users with plaintext passwords (vulnerable mode)
  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin',
      apiKey: 'demo_api_key_12345_not_real',
    },
    {
      username: 'user1',
      email: 'user1@example.com',
      password: 'Password123',
      role: 'user',
      apiKey: null,
    },
    {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'john1234',
      role: 'user',
      apiKey: null,
    },
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user,
    })
  }

  // Create some sample messages
  const messages = [
    {
      author: 'admin',
      content: 'Welcome to the vulnerability demo app!',
    },
    {
      author: 'user1',
      content: 'This is a test message.',
    },
  ]

  for (const message of messages) {
    await prisma.message.create({
      data: message,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
