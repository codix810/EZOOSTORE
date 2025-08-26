import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Tshirt", default: null },
  name: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  imageUrl: { type: String },
      status: { type: String, default: "قيد المعالجة" }, // حالة الطلب

});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  governorate: { type: String, required: true },
  address: { type: String, required: true },
});

const TshirtOrderSchema = new mongoose.Schema(
  {
    items: { type: [ItemSchema], required: true }, // array of items
    discount: { type: Number, default: 0 },
    coupon: { type: String, default: "" },
    shipping: { type: Number, default: 20 },
    total: { type: Number, required: true },
    status: { type: String, default: "قيد المعالجة" }, // حالة الطلب
    user: { type: mongoose.Schema.Types.ObjectId, ref: "userazo", required: true },
    customer: { type: CustomerSchema, required: true },
  },
  { timestamps: true }
);

export const TshirtOrder =
  mongoose.models.TshirtOrder || mongoose.model("TshirtOrder", TshirtOrderSchema);
