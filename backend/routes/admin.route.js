const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protectRoute, requireAdmin } = require('../middlewares/auth.middleware');

router.use(protectRoute, requireAdmin);

router.get('/check',adminController.checkAdmin);
router.delete('/delete/:id',adminController.deleteUser);
router.get('/users',adminController.getUsers);
router.get('/users/:id',adminController.getUserById);
router.get('/stats' ,adminController.getStats);
export default router;