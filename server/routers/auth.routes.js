import { Router } from "express";
import {
  Register,
  Login,
  GetCurrentUser,
} from "../controllers/auth.controllers.js";

const AuthRoutes = Router();

AuthRoutes.post("/register", Register);
AuthRoutes.post("/login", Login);
AuthRoutes.post("/get-current-user", GetCurrentUser);

export default AuthRoutes;
