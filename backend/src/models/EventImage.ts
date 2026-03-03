import mongoose, { Schema, Document } from 'mongoose';

export interface IEventImage extends Document {
  event: mongoose.Types.ObjectId;
  url: string;
  created_at: Date;
}

const EventImageSchema: Schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  url: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IEventImage>('EventImage', EventImageSchema);
