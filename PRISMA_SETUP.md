# Prisma Setup Guide for SkillForge AI Backend

## 🚨 Current Issue
The database connection is failing due to authentication issues. This guide will help you resolve this.

## 🔧 Step-by-Step Setup

### 1. Check Your .env File
Make sure you have a `.env` file in your root directory with:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/skillforge_ai"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000
```

### 2. PostgreSQL Setup

#### Option A: Local PostgreSQL Installation
1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: Start from Services or use `net start postgresql`
   - macOS: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. **Create database and user**:
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE skillforge_ai;

# Create user (replace 'yourusername' and 'yourpassword')
CREATE USER yourusername WITH PASSWORD 'yourpassword';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE skillforge_ai TO yourusername;

# Exit
\q
```

#### Option B: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name postgres-skillforge \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_USER=yourusername \
  -e POSTGRES_DB=skillforge_ai \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Update Your .env File
Replace the DATABASE_URL with your actual credentials:

```env
# For local installation
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/skillforge_ai"

# For Docker (if using default postgres user)
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/skillforge_ai"
```

### 4. Test Database Connection
```bash
# Test the connection
npm run db:setup
```

### 5. Push Schema to Database
```bash
# Push the schema (creates tables)
npm run db:push
```

### 6. Generate Prisma Client
```bash
# Generate the client
npm run db:generate
```

## 🔍 Troubleshooting

### Authentication Failed (P1000)
- Check username and password in DATABASE_URL
- Verify user exists and has correct permissions
- Try connecting with psql to test credentials

### Connection Failed (P1001)
- Ensure PostgreSQL is running
- Check if port 5432 is accessible
- Verify database name exists

### Database Doesn't Exist
- Create the database manually
- Check if you're connecting to the right server

## 📊 Database Schema
Once connected, Prisma will create these tables:

- **users**: User accounts and credentials
- **user_sessions**: Active authentication sessions
- **ai_interactions**: AI service usage tracking

## 🚀 Next Steps
After successful database setup:

1. **Start the server**: `npm start`
2. **Test registration**: `POST /api/auth/register`
3. **Test login**: `POST /api/auth/login`
4. **View database**: `npm run db:studio`

## 🆘 Still Having Issues?

### Check PostgreSQL Status
```bash
# Windows
sc query postgresql

# macOS/Linux
sudo systemctl status postgresql
```

### Test Connection Manually
```bash
psql -h localhost -U yourusername -d skillforge_ai
```

### Check Logs
```bash
# Windows: Check Event Viewer
# macOS/Linux: Check system logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 📝 Example Working .env
```env
DATABASE_URL="postgresql://skillforge_user:mySecurePassword123@localhost:5432/skillforge_ai"
JWT_SECRET="my-super-secret-jwt-key-2024"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## 🔐 Security Notes
- Use strong passwords for database users
- Don't commit .env files to version control
- Consider using environment-specific .env files
- Use connection pooling for production 