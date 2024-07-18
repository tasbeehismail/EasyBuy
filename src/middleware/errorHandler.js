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
    if(req.file){
        const moduleName = req.originalUrl.split('api/')[1].split('/')[0];
        deleteFileIfExists(moduleName, req.file.filename);
    }
    
    res.status(code).json(response);
};
