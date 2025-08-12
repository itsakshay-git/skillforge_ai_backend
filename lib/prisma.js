const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const logFile = './prisma-queries.log';

function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

// Listen to logs and write them to file
prisma.$on('query', (e) => {
  logToFile(`QUERY: ${e.query} | params: ${e.params} | duration: ${e.duration}ms`);
});

prisma.$on('info', (e) => {
  logToFile(`INFO: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logToFile(`WARN: ${e.message}`);
});

prisma.$on('error', (e) => {
  logToFile(`ERROR: ${e.message}`);
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect()
})

process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})

module.exports = prisma 