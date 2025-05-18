// app/api/users/[id]/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('DELETE request received for user:', params.id) // Debug log
  
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    // 1. Delete auth user first
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(params.id)
    console.log('Auth delete result:', authError ? authError : 'Success') // Debug log
    
    if (authError) throw authError

    // 2. Delete profile record
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', params.id)
      
    console.log('Profile delete result:', profileError ? profileError : 'Success') // Debug log
    if (profileError) throw profileError

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error: any) {
    console.error('Full error:', error) // Detailed error log
    return NextResponse.json(
      { error: error.message || 'Deletion failed' },
      { status: 500 }
    )
  }
}