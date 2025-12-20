# Civic Engagement Platform

This repository contains a complete, production-ready, full-stack civic engagement platform designed for a Gen-Z audience. It includes a React Native mobile app, a Next.js web app, and a Node.js backend.

## Project Structure

```
/
├── backend/          # Node.js + Express + Prisma + PostgreSQL API
├── frontend-mobile/  # React Native + Expo mobile app
├── frontend-web/     # Next.js 14 web application
└── README.md         # This file
```

## Overall Product Goal

Create a Gen-Z-friendly civic engagement platform where users can:
- Enter their ZIP code to find their district and representatives.
- See a personalized, swipeable feed of federal and state bills.
- Read AI-generated plain-English summaries of bills.
- Upvote/downvote bills.
- Propose community amendments (cleaned by AI).
- Track bills and receive notifications.
- Access the app on both web and mobile.

## Tech Stack

| Component         | Tech Stack                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| **Backend**       | Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT, OpenAI           |
| **Mobile Frontend** | React Native, Expo, TypeScript, React Navigation, Axios                 |
| **Web Frontend**    | Next.js 14 (App Router), TypeScript, TailwindCSS, Axios                 |

## Local Development Setup

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env # Edit with your database URL, JWT secret, and API keys

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

The backend will be running at `http://localhost:3001`.

### 2. Web Frontend Setup

```bash
# Navigate to the web frontend directory
cd ../frontend-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
nano .env.local # Ensure NEXT_PUBLIC_API_BASE_URL points to your backend

# Start the development server
npm run dev
```

The web app will be available at `http://localhost:3000`.

### 3. Mobile Frontend Setup

```bash
# Navigate to the mobile frontend directory
cd ../frontend-mobile

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env # Ensure API_BASE_URL points to your backend

# Start the Expo development server
npm start
```

Scan the QR code with the Expo Go app on your phone to run the mobile app.

## Deployment Instructions

### Backend (Railway)

1.  **Create a Railway Project**: Go to [railway.app](https://railway.app) and create a new project.
2.  **Add PostgreSQL**: Add a new PostgreSQL database service.
3.  **Connect GitHub**: Connect your GitHub repository and select the `backend` directory.
4.  **Add Environment Variables**: In the project settings, add the following environment variables:
    -   `DATABASE_URL` (from your Railway PostgreSQL service)
    -   `JWT_SECRET`
    -   `PROPUBLICA_API_KEY`
    -   `OPENSTATES_API_KEY`
    -   `OPENAI_API_KEY`
    -   `PORT` (Railway sets this automatically)
5.  **Deploy**: Railway will automatically deploy the backend. The build command is `npm run build` and the start command is `npm start`.

### Web Frontend (Vercel)

1.  **Create a Vercel Project**: Go to [vercel.com](https://vercel.com) and import your GitHub repository.
2.  **Configure Project**: 
    -   Select **Next.js** as the framework preset.
    -   Set the **Root Directory** to `frontend-web`.
3.  **Add Environment Variables**: Add `NEXT_PUBLIC_API_BASE_URL` and point it to your deployed backend URL.
4.  **Deploy**: Vercel will build and deploy the web application.

### Mobile App (Expo Publish)

1.  **Login to Expo**: 
    ```bash
    cd frontend-mobile
    npx expo login
    ```
2.  **Publish the App**:
    ```bash
    npx expo publish
    ```
    This will publish your app to the Expo servers, making it accessible via the Expo Go app to anyone with the link.

3.  **Build for App Stores (EAS)**:
    For native builds for the Apple App Store and Google Play Store, use Expo Application Services (EAS).
    ```bash
    # Build for iOS
npx eas build --platform ios

    # Build for Android
npx eas build --platform android
    ```

## Vercel Configuration (`vercel.json`)

For the `frontend-web` directory, you can add a `vercel.json` file to configure build settings if needed. Here is an example:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend-web/next.config.js",
      "use": "@vercel/next",
      "config": { "distDir": ".next" }
    }
  ]
}
```

However, Vercel's automatic detection for Next.js is usually sufficient.
