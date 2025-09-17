const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/colleges', adminAuth, adminController.createCollege);
router.post('/colleges/import-csv', adminAuth, upload.single('file'), adminController.importCsv);

module.exports = router;
