import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import NotificationRoutes from "./notification.routes.js";

const AllRouters = Router();

AllRouters.use("/auth", AuthRoutes);
AllRouters.use("/notification", NotificationRoutes);

export default AllRouters;
