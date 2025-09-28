import { Router } from "express";
import AuthRoutes from "./auth.routes.js";

const AllRouters = Router();

AllRouters.use("/auth", AuthRoutes);

export default AllRouters;
