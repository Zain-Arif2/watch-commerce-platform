import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a brand name'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      public_id: String,
      url: String,
    },
    description: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Brand', brandSchema);
