import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'NOT SET',
      nextauthSecret: process.env.NEXTAUTH_SECRET ? 'set' : 'NOT SET',
      nextauthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error?.message || 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'set (but failing)' : 'NOT SET',
    }, { status: 500 })
  }
}