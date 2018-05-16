const controllers = require('../controllers');
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

module.exports = (app) => {

    //user funcs
    app.post('/register', controllers.userController.register.post);
    app.post('/login', controllers.userController.login.post);
    app.post('/logout', controllers.userController.logout);

    //document funcs
    app.post('/upload', upload.single('file'), controllers.bigChainDBController.upload.post);
    app.post('/download', upload.single('file'), controllers.bigChainDBController.downloadAsset.post);
    app.post('/searchAssetById', upload.fields(), controllers.bigChainDBController.searchAssetById.post);
    app.post('/searchAssetByMetadata', upload.fields(), controllers.bigChainDBController.searchAssetByMetadata.post);
};