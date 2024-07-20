import { deleteFileIfExists } from '../utils/fileHelper.js';

export default (err, req, res, next) => {
    //console.error(`Async Handler: ${err.stack}`);
    const code = err.statusCode || 500;
    const response = {
        error: err.message,
        code: code,
        success: false,
    };
    
    if (err.data) {
        response.data = err.data; 
    }
    const moduleName = req.originalUrl.split('api/')[1].split('/')[0];
    if(req.file){
        deleteFileIfExists(moduleName, req.file.filename);
    }
    if (req.files && req.files.images) {
        req.files.images.forEach(file => {
            deleteFileIfExists(moduleName, file.filename);
        });
    }
    if(req.files.coverImage){
        deleteFileIfExists(moduleName, req.files.coverImage[0].filename);
    }
    res.status(code).json(response);
};
