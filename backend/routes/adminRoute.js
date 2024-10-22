import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel, addExpert, adminDashboard, allExpert } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/expertController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-expert", authAdmin, upload.single('image'), addExpert)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-experts", authAdmin, allExpert)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;