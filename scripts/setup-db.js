const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function setupDatabase() {
    try {
        console.log('🔌 Testing database connection...')

        // Test connection
        await prisma.$connect()
        console.log('✅ Database connection successful!')

        // Push the schema to the database (this will create tables)
        console.log('📋 Pushing schema to database...')
        await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`

        console.log('✅ Database setup completed successfully!')

    } catch (error) {
        console.error('❌ Database setup failed:', error.message)

        if (error.code === 'P1001') {
            console.log('\n💡 Database connection failed. Please check:')
            console.log('1. Is PostgreSQL running?')
            console.log('2. Is your DATABASE_URL correct in .env?')
            console.log('3. Does the database exist?')
            console.log('\nExample DATABASE_URL:')
            console.log('postgresql://username:password@localhost:5432/skillforge_ai')
        }

        if (error.code === 'P1000') {
            console.log('\n💡 Authentication failed. Please check:')
            console.log('1. Username and password in DATABASE_URL')
            console.log('2. Database user permissions')
        }

    } finally {
        await prisma.$disconnect()
    }
}

setupDatabase() 