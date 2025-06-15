// Database setup script for Medilocker
// Run these SQL commands in your Supabase SQL Editor

const setupCommands = `
-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet_address TEXT NOT NULL,
  file_name TEXT NOT NULL,
  ipfs_cid TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create access_grants table
CREATE TABLE IF NOT EXISTS access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  access_code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_wallet_address ON documents(user_wallet_address);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_access_grants_code ON access_grants(access_code);
CREATE INDEX IF NOT EXISTS idx_access_grants_expires_at ON access_grants(expires_at);

-- Enable Row Level Security (optional for production)
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE access_grants ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (uncomment for production)
-- CREATE POLICY "Users can view their own documents" ON documents
--   FOR SELECT USING (user_wallet_address = current_user);

-- CREATE POLICY "Users can insert their own documents" ON documents
--   FOR INSERT WITH CHECK (user_wallet_address = current_user);

-- CREATE POLICY "Anyone can view valid access grants" ON access_grants
--   FOR SELECT USING (expires_at > NOW());

-- CREATE POLICY "Users can create access grants for their documents" ON access_grants
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM documents 
--       WHERE documents.id = access_grants.document_id 
--       AND documents.user_wallet_address = current_user
--     )
--   );
`;

console.log('Database setup commands:');
console.log(setupCommands);
console.log('\nInstructions:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Copy and paste the above SQL commands');
console.log('4. Execute the commands');
console.log('\nNote: RLS policies are commented out for development. Uncomment for production use.');
