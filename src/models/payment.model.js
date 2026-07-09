const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "net_banking", "wallet", "cod"],
      required: true,
    },

    paymentProvider: {
      type: String,
      enum: ["razorpay", "stripe", "cashfree", "phonepe", "paytm", "cod"],
      required: true,
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "successful",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ customer: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentMethod: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;