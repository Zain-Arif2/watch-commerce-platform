import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      public_id: String,
      url: String,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
