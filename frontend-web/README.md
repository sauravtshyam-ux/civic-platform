# Civic Platform Web App

Next.js 14 web application for the civic engagement platform with App Router and TailwindCSS.

## Features

- **Authentication**: Login and registration with JWT
- **Bills Feed**: Browse federal and state bills
- **Bill Details**: View full bill information with AI summaries
- **Voting**: Upvote/downvote bills and amendments
- **Amendments**: Propose and view community amendments
- **Notifications**: View and manage notifications
- **Profile**: User profile with location information
- **Responsive Design**: Mobile-first, works great on all devices

## Prerequisites

- Node.js 18+
- Backend API running

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your backend URL
nano .env.local
```

## Running the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The app will be available at http://localhost:3000

## Project Structure

```
frontend-web/
├── app/
│   ├── onboarding/      # Login/Register page
│   ├── explore/         # Bills feed
│   ├── bill/[billId]/   # Bill detail page
│   ├── amend/[billId]/  # Amendment submission
│   ├── notifications/   # Notifications page
│   ├── profile/         # User profile
│   ├── layout.tsx       # Root layout with Navbar
│   └── globals.css      # Global styles with Tailwind
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   └── BillCard.tsx     # Bill card component
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   └── useBills.ts      # Bills data hook
├── lib/
│   └── api.ts           # API client
└── package.json
```

## Pages

- `/` - Home (redirects to /explore)
- `/onboarding` - Login/Register
- `/explore` - Bills feed
- `/bill/[billId]` - Bill details
- `/amend/[billId]` - Propose amendment
- `/notifications` - User notifications
- `/profile` - User profile

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_BASE_URL`
4. Deploy

### Manual Deployment

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:3001/api)

## Design System

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **Primary Color**: Indigo (#6366f1)
- **Secondary Color**: Pink (#ec4899)
- **Typography**: Inter font
- **Components**: Clean, modern, Gen-Z-friendly

## License

MIT
