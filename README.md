# Fitpage Assignment

This project is a part of the Fitpage Assignment, which involves building an API for managing reviews for various events.

## Overview

The project aims to provide a platform for users to submit reviews for events they have attended. It allows users to rate events, provide overall ratings, like reviews, report inappropriate content, and allows event organizers to respond to reviews.

## Technologies Used

- Node.js: Backend JavaScript runtime environment
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing reviews and user data
- Mongoose: MongoDB object modeling tool for Node.js
- JSON Web Tokens (JWT): For user authentication and authorization
- bcryptjs: For hashing passwords before storing them in the database
- Express-validator: For request validation and sanitization
- Postman: For testing API endpoints

## Installation

1. Clone the repository:

```bash
git clone <repository_url>
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
```

Replace `<your_mongodb_uri>` with your MongoDB connection string and `<your_jwt_secret>` with a secret key for JWT token generation.

4. Start the server:

```bash
npm start
```

## API Endpoints

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and generate JWT token
- **GET /api/reviews**: Get paginated list of reviews
- **GET /api/reviews/summary/:eventId**: Generate summary of reviews for a specific event
- **POST /api/reviews**: Create a new review
- **GET /api/reviews/:id**: Get a review by ID
- **PUT /api/reviews/:id**: Update a review
- **DELETE /api/reviews/:id**: Delete a review
- **POST /api/reviews/:id/like**: Like a review
- **POST /api/reviews/:id/report**: Report a review
- **POST /api/reviews/:id/response**: Add a response to a review

## Author

[Dharmendra]