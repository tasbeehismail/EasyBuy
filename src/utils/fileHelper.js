import fs from 'fs';
import path from 'path';

/**
 * Deletes a file if it exists.
 *
 * @param {string} moduleName - The name of the module (e.g., 'brand').
 * @param {string} fileName - The name of the file to delete.
 */
export const deleteFileIfExists = (moduleName, fileName) => {
    if (!fileName) return;

    const relativePath = fileName.replace(`${process.env.BASE_URL}/uploads/`, '');
    const filePath = path.join('uploads', relativePath);

    //console.log(`Deleting file: ${filePath}`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
