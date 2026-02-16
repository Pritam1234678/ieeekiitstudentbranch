import mongoose, { Schema, Document } from 'mongoose';

export interface ISociety extends Document {
  name: string;
  logo_url?: string;
  chair_name?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  faculty_name?: string;
}

const SocietySchema = new Schema<ISociety>(
  {
    name: { type: String, required: true },
    logo_url: { type: String },
    chair_name: { type: String },
    description: { type: String },
    faculty_name: { type: String }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const Society = mongoose.model<ISociety>('Society', SocietySchema);
