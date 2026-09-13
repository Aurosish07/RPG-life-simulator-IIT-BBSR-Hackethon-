import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        { error: 'Database configuration error: DATABASE_URL not set' },
        { status: 500 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        character: {
          create: {
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            gold: 0,
          },
        },
      },
      include: {
        character: true,
      },
    })

    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'Account created successfully', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error?.message, error?.stack)
    return NextResponse.json(
      {
        error: 'Registration failed',
        detail: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}