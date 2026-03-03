import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
// Use process.cwd() to match the static file serving path in server.ts
const uploadDir = path.join(process.cwd(), 'public/uploads/events');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.heic'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (file.mimetype.startsWith('image/') && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only PNG, JPG, WEBP, HEIC, and GIF images are allowed. SVG and scripts are blocked.'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
