import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { accessCode: string } }
) {
  try {
    const { accessCode } = params

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      )
    }

    // Find the access grant
    const { data: grantData, error: grantError } = await supabase
      .from('access_grants')
      .select('*')
      .eq('access_code', accessCode)
      .single()

    if (grantError || !grantData) {
      return NextResponse.json(
        { error: 'Invalid or expired access code' },
        { status: 404 }
      )
    }

    // Check if access grant has expired
    if (new Date(grantData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Access code has expired' },
        { status: 410 }
      )
    }

    // Get the document details
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', grantData.document_id)
      .single()

    if (documentError || !documentData) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document: documentData,
      expiresAt: grantData.expires_at
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to retrieve document' },
      { status: 500 }
    )
  }
} 