const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function testPrisma() {
    try {
        console.log('🧪 Testing Prisma setup...')

        // Test connection
        await prisma.$connect()
        console.log('✅ Database connection successful!')

        // Test basic operations
        console.log('📝 Testing basic operations...')

        // Test user creation
        const testUser = await prisma.user.create({
            data: {
                username: 'test_user_' + Date.now(),
                email: `test${Date.now()}@example.com`,
                passwordHash: 'test_hash'
            }
        })
        console.log('✅ User creation successful:', testUser.id)

        // Test user retrieval
        const retrievedUser = await prisma.user.findUnique({
            where: { id: testUser.id }
        })
        console.log('✅ User retrieval successful:', retrievedUser.username)

        // Test user update
        const updatedUser = await prisma.user.update({
            where: { id: testUser.id },
            data: { username: 'updated_test_user' }
        })
        console.log('✅ User update successful:', updatedUser.username)

        // Test user deletion
        await prisma.user.delete({
            where: { id: testUser.id }
        })
        console.log('✅ User deletion successful')

        console.log('\n🎉 All Prisma tests passed!')
        console.log('🚀 Your Prisma setup is working correctly.')

    } catch (error) {
        console.error('❌ Prisma test failed:', error.message)

        if (error.code === 'P2002') {
            console.log('💡 Unique constraint violation - this is expected for duplicate tests')
        } else if (error.code === 'P2025') {
            console.log('💡 Record not found - this is expected for deletion tests')
        } else {
            console.log('💡 Unexpected error occurred')
        }

    } finally {
        await prisma.$disconnect()
    }
}

testPrisma() 