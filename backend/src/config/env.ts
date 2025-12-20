import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  databaseUrl: process.env.DATABASE_URL,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // External API Keys
  proPublicaApiKey: process.env.PROPUBLICA_API_KEY,
  openStatesApiKey: process.env.OPENSTATES_API_KEY,
  openAiApiKey: process.env.OPENAI_API_KEY,
};
