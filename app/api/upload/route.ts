import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import formidable from 'formidable'
import { pinata } from '@/lib/pinata'
import { supabase } from '@/lib/supabase'

// Required for formidable to work with Next.js API routes
export const config = {
  api: {
    bodyParser: false,
  },
}

const parseForm = (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({})
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req)
    const userWalletAddress = fields.userWalletAddress?.[0]
    const file = files.file?.[0]

    if (!file || !userWalletAddress) {
      return NextResponse.json(
        { error: 'File and wallet address are required' },
        { status: 400 }
      )
    }

    // 1. Upload to IPFS
    const readableStreamForFile = fs.createReadStream(file.filepath)
    const options = {
      pinataMetadata: {
        name: file.originalFilename
      }
    }

    const result = await pinata.pinFileToIPFS(readableStreamForFile, options)

    // 2. Save metadata to Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        user_wallet_address: userWalletAddress,
        file_name: file.originalFilename,
        ipfs_cid: result.IpfsHash
      }])
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      data: data[0]
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
} 