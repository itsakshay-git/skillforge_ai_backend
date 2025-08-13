const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const logFile = './prisma-queries.log';
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB

function logToFile(message) {
  try {
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      if (stats.size > MAX_LOG_SIZE) {
        // Option 1: clear file
        fs.truncateSync(logFile, 0);
        // Option 2: rotate file
        // fs.renameSync(logFile, `${logFile}.${Date.now()}.bak`);
      }
    }

    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  } catch (err) {
    console.error('Failed to write log:', err);
  }
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