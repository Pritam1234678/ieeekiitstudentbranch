import fs from 'fs';
import path from 'path';

/**
 * Deletes a file from the public directory given its URL path.
 * @param fileUrl The relative URL path (e.g., '/uploads/members/123.jpg')
 */
export function deleteFile(fileUrl?: string) {
  if (!fileUrl) return;
  
  // Construct absolute path to the file in the public directory
  const filePath = path.join(__dirname, '../../public', fileUrl);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  }
}
