const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Snapshot fields
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      default: "",
    },

    productWeight: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

orderItemSchema.index({ order: 1 });
orderItemSchema.index({ product: 1 });

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;