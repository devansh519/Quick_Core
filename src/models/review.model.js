const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per customer per product per order
reviewSchema.index(
  {
    customer: 1,
    product: 1,
    order: 1,
  },
  {
    unique: true,
  }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ rating: -1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;