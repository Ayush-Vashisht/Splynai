
import mongoose, { Schema, Document } from "mongoose";

interface ICar extends Document {
  title: string;
  description?: string;
  carType?: string;
  dealer?: string;
  tags?: string[];
  images?: string[];
  user: mongoose.Types.ObjectId;
}

const CarSchema = new Schema<ICar>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  carType: {
    type: String,
  },
  dealer: {
    type: String,
  },
  tags: {
    type: [String],
  },
  images: {
    type: [String],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Cars = mongoose.models?.Cars || mongoose.model<ICar>("Cars", CarSchema);
export default Cars;
