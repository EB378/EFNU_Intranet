// app/api/users/update-email/route.ts
import adminClient from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {


  try {
    

    // 3. Parse and validate request body
    const { userId, newEmail } = await request.json()


    // 6. Update auth email
    const { data: updatedUser, error: updateError } = await adminClient.auth.admin.updateUserById(
      userId,
      { 
        email: newEmail,
        email_confirm: true // Skip confirmation email
      }
    )

    if (updateError) {
      throw updateError
    }

    // 7. Update profile email
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ email: newEmail })
      .eq('id', userId)

    if (profileError) throw profileError

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email updated successfully',
        newEmail 
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Email Update Error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Email update failed',
        code: error.code || 'unknown_error',
        details: error.details || null
      },
      { status: 500 }
    )
  }
}
