import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const { email, password, user_metadata } = await request.json()

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 1. Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || undefined,
      email_confirm: true,
      user_metadata: {
        ...user_metadata,
        created_by_admin: true
      }
    })

    if (authError) {
      throw authError
    }

    // 2. Create profile record
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email,
        fullname: user_metadata?.fullname,
        licence: user_metadata?.licence,
        status: user_metadata?.status || 'active',
        role: user_metadata?.role || 'pilot'
      })

    if (profileError) {
      throw profileError
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