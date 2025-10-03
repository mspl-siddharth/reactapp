import { Router } from "express";
import { sendNotification } from "../controllers/notification.controllers.js";

const NotificationRoutes = Router();

NotificationRoutes.post("/send", sendNotification);

export default NotificationRoutes;
