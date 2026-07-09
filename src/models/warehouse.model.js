const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Warehouse name is required"],
      trim: true,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    serviceRadius: {
      type: Number,
      required: true,
      default: 5, // kilometers
      min: 1,
    },

    capacity: {
      type: Number,
      default: 10000,
      min: 0,
    },

    currentLoad: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "maintenance",
      ],
      default: "active",
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geo Index
warehouseSchema.index({ location: "2dsphere" });

// Other Indexes
warehouseSchema.index({ code: 1 });
warehouseSchema.index({ status: 1 });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;