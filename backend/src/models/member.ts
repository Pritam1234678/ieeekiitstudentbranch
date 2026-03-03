import mongoose, { Schema, Document } from 'mongoose';

export enum MemberPosition {
  CHAIR = 'Chair',
  VICE_CHAIR = 'Vice Chair',
  SECRETARY = 'Secretary',
  TREASURER = 'Treasurer',
  JOINT_SECRETARY = 'Joint Secretary',
  JOINT_TREASURER = 'Joint Treasurer',
  WEBMASTER = 'Webmaster',
  MEMBER = 'Member',
  FACULTY = 'Faculty In Charge',
  DIRECTOR = 'Director'
}

export interface IMember extends Document {
  fullname: string;
  email: string;
  linkedin?: string;
  photo_url?: string;
  position: MemberPosition;
  created_at: Date;
  updated_at: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    linkedin: { type: String },
    photo_url: { type: String },
    position: {
      type: String,
      enum: Object.values(MemberPosition),
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const Member = mongoose.model<IMember>('Member', MemberSchema);
