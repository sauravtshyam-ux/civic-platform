# Civic Platform Mobile App

React Native + Expo mobile application for the civic engagement platform.

## Features

- **Authentication**: Login and registration with JWT
- **Bills Feed**: Swipeable feed of federal and state bills
- **Bill Details**: View full bill information with AI summaries
- **Voting**: Upvote/downvote bills and amendments
- **Amendments**: Propose and view community amendments
- **Profile**: User profile with location information
- **Gen-Z Design**: Modern, colorful, engaging UI

## Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your backend URL
nano .env
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Project Structure

```
frontend-mobile/
├── app/
│   ├── api/            # API client and services
│   ├── components/     # Reusable components
│   ├── context/        # React context (Auth)
│   ├── hooks/          # Custom hooks
│   ├── navigation/     # Navigation setup
│   ├── screens/        # Screen components
│   ├── theme/          # Colors and styling
│   └── types/          # TypeScript types
├── assets/             # Images and static files
├── App.tsx             # Main entry point
├── app.json            # Expo configuration
└── package.json
```

## Screens

- **Onboarding**: Login/Register
- **Home**: Bills feed with filtering
- **Bill Detail**: Full bill information with amendments
- **Profile**: User information and settings

## Publishing with Expo

```bash
# Login to Expo
expo login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Publish update
expo publish
```

## Environment Variables

- `API_BASE_URL`: Backend API URL (default: http://localhost:3001/api)

## Design System

- **Primary Color**: Indigo (#6366f1)
- **Secondary Color**: Pink (#ec4899)
- **Typography**: System fonts with clear hierarchy
- **Components**: Rounded cards, bright accents, emoji usage

## License

MIT
