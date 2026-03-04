import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// --- Strict MIME ↔ Extension Whitelist ---
const ALLOWED: Record<string, string[]> = {
    'image/jpeg':  ['.jpg', '.jpeg'],
    'image/png':   ['.png'],
    'image/webp':  ['.webp'],
    'image/gif':   ['.gif'],
    'image/heic':  ['.heic', '.heif'],
    'image/heif':  ['.heif', '.heic'],
};

// Magic-byte signatures for supported formats
const MAGIC_BYTES: Array<{ mime: string; offset: number; bytes: number[] }> = [
    { mime: 'image/jpeg', offset: 0, bytes: [0xFF, 0xD8, 0xFF] },
    { mime: 'image/png',  offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47] },
    { mime: 'image/gif',  offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
    { mime: 'image/webp', offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
    // HEIC/HEIF — ftyp box at offset 4
    { mime: 'image/heic', offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] },
    { mime: 'image/heif', offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] },
];

function matchesMagicBytes(buffer: Buffer, mime: string): boolean {
    const signatures = MAGIC_BYTES.filter(m => m.mime === mime);
    if (signatures.length === 0) return true; // no signature rule → allow
    return signatures.some(sig => {
        const slice = buffer.slice(sig.offset, sig.offset + sig.bytes.length);
        return sig.bytes.every((b, i) => slice[i] === b);
    });
}

// --- Disk Storage ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'events';
        if (req.originalUrl?.includes('/api/members')) folder = 'members';

        const uploadDir = path.join(process.cwd(), `public/uploads/${folder}`);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // Sanitize: only keep the last (real) extension, no double extensions
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + ext);
    },
});

// --- fileFilter: MIME + extension consistency check ---
// Dangerous secondary extensions that should never appear before the image extension
const DANGEROUS_EXTENSIONS = [
    '.php', '.php3', '.php4', '.php5', '.phtml',
    '.exe', '.sh', '.bat', '.cmd', '.ps1',
    '.py', '.rb', '.pl', '.cgi',
    '.asp', '.aspx', '.jsp',
    '.htaccess', '.svg',
];

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimes = Object.keys(ALLOWED);
    const ext = path.extname(file.originalname).toLowerCase();

    // 1. Only block if a DANGEROUS extension is hiding before the image extension
    //    (e.g. "shell.php.jpg" is blocked, but "my.photo.jpg" is fine)
    const basename = path.basename(file.originalname, ext);
    const secondExt = path.extname(basename).toLowerCase();
    if (secondExt && DANGEROUS_EXTENSIONS.includes(secondExt)) {
        return cb(new Error(`Dangerous filename detected: "${secondExt}" is not allowed inside an image filename.`), false);
    }

    // 2. MIME must be in the whitelist
    if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error(`File type "${file.mimetype}" is not allowed. Accepted: JPEG, PNG, WEBP, GIF, HEIC.`), false);
    }

    // 3. Extension must match declared MIME
    const validExtensions = ALLOWED[file.mimetype];
    if (!validExtensions.includes(ext)) {
        return cb(new Error(`File extension "${ext}" does not match MIME type "${file.mimetype}".`), false);
    }

    cb(null, true);
};

// --- Multer instance ---
export const upload = multer({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB
        files: 20,                   // allow up to 20 files per request for galleries
    },
    fileFilter,
});

// --- Post-upload magic-byte validation middleware ---
// Use AFTER upload.single() / upload.array() in your route chain.
export function validateImageBytes(req: Request, res: Response, next: NextFunction) {
    const files = (req as any).files as Express.Multer.File[] | undefined;
    const file = (req as any).file as Express.Multer.File | undefined;
    
    const uploadedFiles = file ? [file] : (files && Array.isArray(files) ? files : []);
    
    if (uploadedFiles.length === 0) return next();

    try {
        for (const f of uploadedFiles) {
            // Read only the first 12 bytes — enough for all our signatures
            const fd = fs.openSync(f.path, 'r');
            const buf = Buffer.alloc(12);
            fs.readSync(fd, buf, 0, 12, 0);
            fs.closeSync(fd);

            if (!matchesMagicBytes(buf, f.mimetype)) {
                // cleanup all files
                for (const uf of uploadedFiles) {
                    try { if (uf.path) fs.unlinkSync(uf.path); } catch {}
                }
                return res.status(400).json({
                    success: false,
                    error: `File ${f.originalname} content does not match its declared type. Upload rejected.`,
                });
            }
        }
        next();
    } catch (err) {
        // If we can't read it, reject it
        for (const uf of uploadedFiles) {
            try { if (uf.path) fs.unlinkSync(uf.path); } catch {}
        }
        return res.status(500).json({ success: false, error: 'Failed to validate uploaded file(s).' });
    }
}
