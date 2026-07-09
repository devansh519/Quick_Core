const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    pickupTime: {
      type: Date,
      default: null,
    },

    dispatchTime: {
      type: Date,
      default: null,
    },

    deliveredTime: {
      type: Date,
      default: null,
    },

    estimatedDeliveryTime: {
      type: Date,
      default: null,
    },

    actualDistance: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

deliverySchema.index({ driver: 1 });
deliverySchema.index({ warehouse: 1 });
deliverySchema.index({ status: 1 });

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;