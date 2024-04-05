const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Get all reviews with pagination
router.get('/', reviewController.getAllReviews);

// Generate summary for a specific event
router.get('/summary/:eventId', reviewController.generateSummary);

// Create a new review
router.post('/', authMiddleware, [
    body('eventId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('overallRating').isInt({ min: 1, max: 5 }),
], reviewController.createReview);

// Get review by ID
router.get('/:id', reviewController.getReviewById);

// Update review
router.put('/:id', authMiddleware, reviewController.updateReview);

// Delete review
router.delete('/:id', authMiddleware, reviewController.deleteReview);

// Like review
router.post('/:id/like', authMiddleware, reviewController.likeReview);

// Report review
router.post('/:id/report', authMiddleware, reviewController.reportReview);

// Add response to review
router.post('/:id/response', authMiddleware, reviewController.addResponse);

module.exports = router;
