const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);

const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema({
  name: { type: String, required: true },
  imageURL: { type: String, required: false }
});

// Export model
// module.exports = mongoose.model("ProductCategory", ProductCategorySchema);
module.exports = mongoose.model("ProductCategory",  ProductCategorySchema);