const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const authController = require('./controllers/authController');
const reviewController = require('./controllers/reviewController');
const Review = require('./models/Review');
const User = require('./models/User');

require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
})
.catch(err => console.error(err));

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Authentication Routes
app.post('/api/auth/register', [
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
], authController.register);

app.post('/api/auth/login', authController.login);

// Review Routes
app.get('/api/reviews', reviewController.getAllReviews);

app.get('/api/reviews/summary/:eventId', reviewController.generateSummary);

app.post('/api/reviews', authMiddleware, [
    body('eventId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('overallRating').isInt({ min: 1, max: 5 }),
], reviewController.createReview);

app.get('/api/reviews/:id', reviewController.getReviewById);

app.put('/api/reviews/:id', authMiddleware, reviewController.updateReview);

app.delete('/api/reviews/:id', authMiddleware, reviewController.deleteReview);

// Like and Report Routes
app.post('/api/reviews/:id/like', authMiddleware, reviewController.likeReview);

app.post('/api/reviews/:id/report', authMiddleware, reviewController.reportReview);

// Organizer Response Route
app.post('/api/reviews/:id/response', authMiddleware, reviewController.addResponse);

// Error handling middleware
app.use(errorHandler);

