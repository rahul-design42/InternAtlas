import app from './app';
import mongoose from 'mongoose';
import { config } from './config/env';

const startServer = async () => {
  try {
    console.log(`Attempting to connect to MongoDB`);
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');

    app.listen(config.port, () => {
      console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
