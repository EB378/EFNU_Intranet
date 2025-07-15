import { NextResponse } from 'next/server'
import adminClient from '@/utils/supabase/admin'



export async function POST(request: Request) {
  try {
    const { email, password, user_metadata } = await request.json()

    // 1. Create auth user
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: password || undefined,
      email_confirm: true,
      user_metadata: {
        ...user_metadata,
        created_by_admin: true
      },
      app_metadata: {
        ...user_metadata,
        created_by_admin: true
      }
    })

    if (authError) {
      throw authError
    }

    return NextResponse.json({ user: authUser.user }, { status: 200 })
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

// Optionally add other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}