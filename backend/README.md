# Civic Platform Backend

Node.js + Express + TypeScript + PostgreSQL + Prisma backend for the civic engagement platform.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Bills Management**: Federal and state bills with AI summaries
- **Voting System**: Upvote/downvote bills and amendments
- **Amendments**: User-proposed amendments with AI moderation
- **Notifications**: Real-time notification system
- **External APIs**: ProPublica Congress API, OpenStates API, OpenAI
- **Security**: Helmet, CORS, rate limiting

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm or npm

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations (development)
pnpm prisma:migrate

# Or push schema (production)
pnpm prisma:push
```

## Running the Server

```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Bills
- `GET /api/bills/feed` - Get bills feed (query: state, district, page, limit, level)
- `GET /api/bills/:billId` - Get bill details
- `POST /api/bills/:billId/vote` - Vote on bill (body: voteType)
- `POST /api/bills/:billId/save` - Save bill
- `DELETE /api/bills/:billId/save` - Unsave bill

### Amendments
- `POST /api/bills/:billId/amendments` - Create amendment (body: content)
- `GET /api/bills/:billId/amendments` - Get bill amendments
- `POST /api/amendments/:id/vote` - Vote on amendment (body: voteType)

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/mark-read` - Mark notifications as read (body: notificationIds)

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PROPUBLICA_API_KEY` - ProPublica Congress API key
- `OPENSTATES_API_KEY` - OpenStates API key
- `OPENAI_API_KEY` - OpenAI API key for summaries

## External API Integration

### ProPublica Congress API
Get your API key at: https://www.propublica.org/datastore/api/propublica-congress-api

### OpenStates API
Get your API key at: https://openstates.org/accounts/profile/

### OpenAI API
Get your API key at: https://platform.openai.com/api-keys

## Deployment

### Railway

1. Create a new project on Railway
2. Add PostgreSQL database
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Add PostgreSQL database
4. Set build command: `pnpm install && pnpm build`
5. Set start command: `pnpm start`
6. Add environment variables
7. Deploy

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   └── index.ts        # Server entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
