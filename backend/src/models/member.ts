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
  FACULTY = 'Faculty Advisor',
  DIRECTOR = 'Counselor'
}

export interface IMember extends Document {
  fullname: string;
  email: string;
  linkedin?: string;
  photo_url?: string;
  position: MemberPosition;
  rank?: number;  // Only for Faculty Advisor — rank 1 = highest
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
    },
    rank: {
      type: Number,
      sparse: true, // allows multiple docs with no rank (non-faculty advisors)
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Unique index on rank scoped to Faculty Advisor position only
MemberSchema.index(
  { rank: 1 },
  { unique: true, sparse: true, partialFilterExpression: { position: 'Faculty Advisor' } }
);

export const Member = mongoose.model<IMember>('Member', MemberSchema);
