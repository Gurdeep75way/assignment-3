import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import passport from "passport";

const router = Router();


router.get("/me", roleAuth(["USER"]), userController.getUserById);

router.post("/register", userValidator.createUser, catchError, userController.createUser);

router.put("/", roleAuth(["USER"]), userValidator.updateUser, catchError, userController.updateUser);

router.post("/login", userValidator.loginUser, catchError, passport.authenticate('login', { session: false }), userController.login)

router.post("/logout", roleAuth(["USER"]), userController.logout);

export default router;
