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
    if(fileName.startsWith('http')){
        fileName = fileName.replace(`${process.env.BASE_URL}/uploads/${moduleName}/`, '');
    }
    const filePath = path.join('uploads/', moduleName, fileName);

    //console.log(`Deleting file: ${filePath}`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
