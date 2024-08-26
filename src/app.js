// Handle uncaught exceptions in the process 
process.on('uncaughtException', (err) => {
    //console.error(err);
})
import express from 'express'; 
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.routes.js'; 
import cors from 'cors';
import setupWebhook from './services/stripe.service.js';

dotenv.config();

/**
 * Bootstrap function to configure the express app.
 *
 * @param {Object} app - The express app to configure.
 * @return {Promise<void>} - A promise that resolves when the configuration is complete.
 */
const bootstrap = async (app) => {

    // Set up Stripe webhook.
    setupWebhook(app);

    app.use(cors());

    // Parse JSON bodies in request.
    app.use(express.json());
    
    // Serve static files from the uploads directory.
    
    app.use('/uploads', express.static('uploads'));

    // Connect to the database.
    await connectDB();

    // Set up routes.
    app.use("/v1/api/", routes);

    // Handle errors after all routes have been checked.
    app.use(errorHandler);
    
    /**
     * Handle unhandled rejections.
     *
     * @param {Error} err - The error that was rejected.
     */
    process.on('unhandledRejection', (err) => {
        //console.error(err);
    });
};

export default bootstrap;