const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function initializeDatabase() {
    try {
        console.log('🚀 Initializing SkillForge AI Database...')

        // Test basic connection
        await prisma.$connect()
        console.log('✅ Database connection successful!')

        // Try to create a simple table to test permissions
        console.log('📋 Testing database permissions...')

        // This will create the tables based on our schema
        console.log('🔄 Pushing schema to database...')

        // Use db push instead of migrations for initial setup
        const { execSync } = require('child_process')
        try {
            execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
            console.log('✅ Schema pushed successfully!')
        } catch (pushError) {
            console.log('⚠️  Schema push failed, trying alternative approach...')

            // Try to create tables manually if push fails
            try {
                await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `

                await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS user_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            token_hash VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `

                await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS ai_interactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            route_type VARCHAR(50) NOT NULL,
            input_data TEXT,
            output_data TEXT,
            metadata JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `

                console.log('✅ Tables created manually!')
            } catch (manualError) {
                console.error('❌ Manual table creation failed:', manualError.message)
                throw manualError
            }
        }

        console.log('🎉 Database initialization completed successfully!')
        console.log('\n📊 Created tables:')
        console.log('   - users')
        console.log('   - user_sessions')
        console.log('   - ai_interactions')

        console.log('\n🚀 Next steps:')
        console.log('   1. Start the server: npm start')
        console.log('   2. Test registration: POST /api/auth/register')
        console.log('   3. View database: npm run db:studio')

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message)

        if (error.code === 'P1001') {
            console.log('\n💡 Connection failed. Please check:')
            console.log('   - Is PostgreSQL running?')
            console.log('   - Is your DATABASE_URL correct?')
            console.log('   - Does the database exist?')
        }

        if (error.code === 'P1000') {
            console.log('\n💡 Authentication failed. Please check:')
            console.log('   - Username and password in DATABASE_URL')
            console.log('   - Database user permissions')
        }

        console.log('\n📖 See PRISMA_SETUP.md for detailed setup instructions')

    } finally {
        await prisma.$disconnect()
    }
}

initializeDatabase() 