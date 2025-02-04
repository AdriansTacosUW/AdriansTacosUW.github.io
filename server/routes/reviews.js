const express = require('express');
const Review = require('../models/Review');  // Ensure the model is correctly imported
const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error });
  }
});

module.exports = router;  // Export the router to be used in app.js
