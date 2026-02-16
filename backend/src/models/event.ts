import mongoose, { Schema, Document } from 'mongoose';

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  PAST = 'PAST'
}

export interface IEvent extends Document {
  title: string;
  image_url?: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
  updated_at: Date;
  status: EventStatus;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    image_url: { type: String },
    description: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for dynamic status calculation
EventSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.start_time) return EventStatus.UPCOMING;
  if (now >= this.start_time && now <= this.end_time) return EventStatus.LIVE;
  return EventStatus.PAST;
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);

// DTOs
export interface CreateEventDTO {
  title: string;
  image_url?: string;
  description?: string;
  start_time: string | Date;
  end_time: string | Date;
}

export interface UpdateEventDTO {
  title?: string;
  image_url?: string;
  description?: string;
  start_time?: string | Date;
  end_time?: string | Date;
}

export interface EventStats {
  total: number;
  upcoming: number;
  live: number;
  past: number;
}
