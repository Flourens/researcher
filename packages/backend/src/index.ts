import { config } from 'dotenv';

// Load environment variables
config();

// Export all agents
export * from './agents';

// Export database client
export { default as prisma } from './database/client';

console.log('AI Grant Researcher Backend initialized');
console.log('Environment:', process.env.NODE_ENV || 'development');
