import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Event } from '../src/models/event';
import EventImage from '../src/models/EventImage';

dotenv.config({ path: path.join(__dirname, '../.env') });

const clearData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear Collections
        const eventsResult = await Event.deleteMany({});
        console.log(`Deleted ${eventsResult.deletedCount} events`);

        const imagesResult = await EventImage.deleteMany({});
        console.log(`Deleted ${imagesResult.deletedCount} event images`);

        // Clear Uploads Directory
        const uploadsDir = path.join(__dirname, '../../public/uploads/events');
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            for (const file of files) {
                if (file !== '.gitkeep') { // Preserve .gitkeep if it exists
                    fs.unlinkSync(path.join(uploadsDir, file));
                }
            }
            console.log(`Cleared ${files.length} files from uploads directory`);
        } else {
             console.log('Uploads directory does not exist, skipping file cleanup');
        }

        console.log('Data cleanup complete');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearData();
