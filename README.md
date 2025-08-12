# SkillForge AI Backend

A comprehensive AI-powered backend service with user authentication and AI interaction tracking, built with **Prisma ORM** and PostgreSQL.

## Features

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Session management
- User profile management

### 🤖 AI Services
- Resume parsing and analysis
- Text summarization
- Code explanation
- Email assistance
- Code quiz generation

### 📊 AI Interaction Tracking
- Store all AI interactions in PostgreSQL using Prisma
- User interaction history
- Feature usage analytics
- Performance metrics

### 🗄️ Database Management
- **Prisma ORM** for type-safe database operations
- Automatic schema management
- Database migrations and seeding
- Prisma Studio for database visualization

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/skillforge_ai"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 2. Database Setup
- Ensure PostgreSQL is running
- Create a database named `skillforge_ai`
- Run database initialization: `npm run db:init`

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Operations
```bash
# Initialize database and create tables
npm run db:init

# Test Prisma setup
npm run db:test

# Push schema changes
npm run db:push

# Generate Prisma client
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio
```

### 5. Start the Server
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout (requires auth)
- `GET /profile` - Get user profile (requires auth)
- `PUT /profile` - Update user profile (requires auth)

### User History Routes (`/api/user`)
- `GET /history` - Get AI interaction history (requires auth)
- `GET /feature-usage` - Get feature usage statistics (requires auth)
- `GET /analytics/:routeType` - Get route-specific analytics (requires auth)

### AI Service Routes
- `POST /api/summarizer/upload` - Text summarization (public)
- `POST /api/summarizer/upload/authenticated` - Text summarization with tracking (requires auth)
- `POST /api/resume/upload` - Resume parsing
- `POST /api/explain` - Code explanation
- `POST /api/email` - Email assistance
- `POST /api/codequiz` - Code quiz generation

## Database Schema (Prisma)

### Prisma Schema
```prisma
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique @db.VarChar(50)
  email        String   @unique @db.VarChar(100)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  sessions       UserSession[]
  aiInteractions AIInteraction[]

  @@map("users")
}

model UserSession {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  tokenHash String   @map("token_hash") @db.VarChar(255)
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_sessions")
}

model AIInteraction {
  id         Int      @id @default(autoincrement())
  userId     Int      @map("user_id")
  routeType  String   @map("route_type") @db.VarChar(50)
  inputData  String?  @map("input_data") @db.Text
  outputData String?  @map("output_data") @db.Text
  metadata   Json?
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("ai_interactions")
}
```

## Usage Examples

### User Registration
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
});
```

### User Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const { token } = await response.json();
```

### Authenticated Request
```javascript
const response = await fetch('/api/summarizer/upload/authenticated', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Get User History
```javascript
const response = await fetch('/api/user/history', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## AI Interaction Tracking

The system automatically tracks all AI interactions for authenticated users using Prisma:

- **Input Data**: What the user provided (files, text, parameters)
- **Output Data**: The AI-generated response
- **Metadata**: Additional context (file types, parameters, lengths)
- **Timestamps**: When the interaction occurred
- **Route Type**: Which AI service was used

## Prisma Benefits

### 🚀 **Type Safety**
- Full TypeScript support
- Compile-time error checking
- Auto-completion in your IDE

### 🔒 **Security**
- SQL injection protection
- Parameterized queries
- Input validation

### 📊 **Developer Experience**
- Prisma Studio for database visualization
- Auto-generated migrations
- Schema introspection
- Connection pooling

### 🛠️ **Database Operations**
```javascript
// Create user
const user = await prisma.user.create({
  data: { username, email, passwordHash }
})

// Find user with relations
const userWithSessions = await prisma.user.findUnique({
  where: { id: userId },
  include: { sessions: true, aiInteractions: true }
})

// Complex queries
const analytics = await prisma.aIInteraction.groupBy({
  by: ['routeType'],
  where: { userId },
  _count: { id: true }
})
```

## Security Features

- Password hashing with bcrypt
- JWT token validation
- Session management in database
- Input validation and sanitization
- CORS configuration
- Token expiration handling

## Development

### Adding New AI Routes
1. Create the controller with interaction tracking
2. Add the route to the appropriate route file
3. Use `AIInteractionService.storeInteraction()` to track usage
4. Apply `authenticateToken` middleware for protected routes

### Database Operations
- Use Prisma Client for all database operations
- Run `npm run db:generate` after schema changes
- Use `npm run db:studio` to view and edit data
- Use `npm run db:push` for schema updates

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npm run db:test

# Initialize database
npm run db:init

# Check Prisma status
npx prisma status
```

### Common Prisma Commands
```bash
# Generate client
npx prisma generate

# Push schema
npx prisma db push

# Reset database
npx prisma db push --force-reset

# Open Studio
npx prisma studio
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update Prisma schema if needed
5. Run `npm run db:generate`
6. Add tests if applicable
7. Submit a pull request

## License

ISC 