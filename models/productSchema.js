const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productCategoryID: {
    type: Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true
  },
  supplierID: {
    type: Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  costPerDay: { type: Schema.Types.Decimal128, required: true },
  imageURL: { type: String },
  quantity: { type: Int32, required: true },
  availableQuantity: { type: Int32, required: true },
  isActive: { type: Boolean, required: true }
});

ProductSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.costPerDay = ret.costPerDay.toString();
    return ret;
  },
});

// Export model
// const ProductType = mongoose.model("ProductCategory", ProductCategorySchema);
module.exports = mongoose.model("Product", ProductSchema);
