const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["bike", "scooter", "bicycle", "car"],
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "offline",
        "online",
        "busy",
        "on_break"
      ],
      default: "offline",
    },

    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    totalDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

driverSchema.index({ warehouse: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ isAvailable: 1 });

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;