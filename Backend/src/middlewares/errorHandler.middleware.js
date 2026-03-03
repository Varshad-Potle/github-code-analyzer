// src/middlewares/errorHandler.middleware.js

/**
 * Global error handling middleware.
 * Catches all errors passed via next(error) and returns a clean JSON response.
 * Must be registered AFTER all routes in app.js.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`❌ [${req.method} ${req.originalUrl}] ${statusCode}: ${message}`);

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
