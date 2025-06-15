import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { documentId, expiresInHours = 24 } = await req.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Generate a unique access code
    const accessCode = crypto.randomBytes(16).toString('hex')
    
    // Calculate expiration time
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + expiresInHours)

    // Save access grant to database
    const { data, error } = await supabase
      .from('access_grants')
      .insert([{
        document_id: documentId,
        access_code: accessCode,
        expires_at: expiresAt.toISOString()
      }])
      .select()

    if (error) throw error

    // Generate share URL
    const shareUrl = `${req.nextUrl.origin}/view/${accessCode}`

    return NextResponse.json({
      success: true,
      accessCode,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
      data: data[0]
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    )
  }
} 