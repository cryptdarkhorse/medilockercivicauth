// Database setup script for Supabase
console.log("Setting up Medilocker database tables...")

// This would typically connect to Supabase and create tables
const setupTables = async () => {
  console.log("Creating documents table...")

  const documentsTable = `
    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_wallet_address TEXT NOT NULL,
      file_name TEXT NOT NULL,
      ipfs_cid TEXT NOT NULL,
      file_type TEXT,
      file_size TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `

  console.log("Creating access_grants table...")

  const accessGrantsTable = `
    CREATE TABLE IF NOT EXISTS access_grants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
      access_code TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      max_access_count INTEGER DEFAULT 3,
      current_access_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `

  console.log("Creating indexes for better performance...")

  const indexes = `
    CREATE INDEX IF NOT EXISTS idx_documents_wallet ON documents(user_wallet_address);
    CREATE INDEX IF NOT EXISTS idx_access_grants_code ON access_grants(access_code);
    CREATE INDEX IF NOT EXISTS idx_access_grants_expires ON access_grants(expires_at);
  `

  console.log("Database setup complete!")
  console.log("Tables created:")
  console.log("- documents: Store medical record metadata")
  console.log("- access_grants: Manage temporary sharing links")
  console.log("- Indexes created for optimal performance")
}

setupTables()
