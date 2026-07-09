const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
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
      min: 0,
      default: 0,
    },

    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },

    maxStockLevel: {
      type: Number,
      default: 100,
      min: 1,
    },

    lastRestockedAt: {
      type: Date,
      default: Date.now,
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

// One product can exist only once per warehouse
inventorySchema.index(
  { warehouse: 1, product: 1 },
  { unique: true }
);

inventorySchema.index({ warehouse: 1 });
inventorySchema.index({ product: 1 });

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;