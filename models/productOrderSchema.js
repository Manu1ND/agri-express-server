const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);

const Schema = mongoose.Schema;

const ProductOrderSchema = new Schema({
  productID: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  farmerID: {
    type: Schema.Types.ObjectId,
    ref: "Farmer",
    required: true
  },
  duration: { type: Int32, required: true },
  quantity: { type: Int32, required: true },
  orderDate: { type: Date, default: Date.now, required: true },
  deliveryDate: { type: Date, default: Date.now, required: true },
  status: { type: String, required: true }
});

// Export model
module.exports = mongoose.model("ProductOrder", ProductOrderSchema);
