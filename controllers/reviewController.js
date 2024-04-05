exports.getAllReviews = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const reviews = await Review.find().skip(skip).limit(limit);
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

exports.generateSummary = async (req, res, next) => {
    const eventId = req.params.eventId;

    try {
        const reviews = await Review.find({ eventId });

        // Calculate average rating
        const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRatings / reviews.length;

        // Count number of flagged reviews
        const flaggedReviews = reviews.filter(review => review.flagged).length;

        // Count number of likes for all reviews
        const totalLikes = reviews.reduce((acc, review) => acc + review.likes.length, 0);

        // Generate summary
        const summary = {
            averageRating,
            totalReviews: reviews.length,
            flaggedReviews,
            totalLikes
        };

        res.json({ summary });
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, rating, overallRating } = req.body;

    try {
        const review = new Review({ eventId, rating, overallRating, user: req.user.id });
        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (err) {
        next(err);
    }
};

exports.getReviewById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    const id = req.params.id;
    const { rating, overallRating } = req.body;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the owner of the review
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        review.rating = rating;
        review.overallRating = overallRating;

        await review.save();

        res.json(review);
    } catch (err) {
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    const id = req.params.id;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the owner of the review
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.remove();

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.likeReview = async (req, res, next) => {
    const id = req.params.id;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user has already liked the review
        if (review.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already liked this review' });
        }

        review.likes.push(req.user.id);
        await review.save();

        res.json({ message: 'Review liked successfully' });
    } catch (err) {
        next(err);
    }
};

exports.reportReview = async (req, res, next) => {
    const id = req.params.id;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user has already reported the review
        if (review.reports.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already reported this review' });
        }

        review.reports.push(req.user.id);

        // Flag the review if reported more than five times
        if (review.reports.length >= 5) {
            review.flagged = true;
        }

        await review.save();

        res.json({ message: 'Review reported successfully' });
    } catch (err) {
        next(err);
    }
};

exports.addResponse = async (req, res, next) => {
    const id = req.params.id;
    const { response } = req.body;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the organizer of the event
        review.response = response;
        await review.save();

        res.json({ message: 'Response added successfully' });
    } catch (err) {
        next(err);
    }
};
