import { Router } from "express";
import * as userController from "../controllers/user.controller";
import * as adminController from "../controllers/admin.controller";
import authorize, { isAllowed } from "../middlewares/auth.middleware";
import {
  loginSchema,
  signupSchema,
  updateUserSchema,
} from "../validators/user.validator";
import validate from "../middlewares/validate.middleware";
const router = Router();

router.post("/signup", validate(signupSchema), userController.signup);
router.post("/login", validate(loginSchema), userController.login);
router.get("/", authorize, isAllowed(["user"]), userController.getProfile);
router.put(
  "/",
  authorize,
  isAllowed(["user"]),
  validate(updateUserSchema),
  userController.udpateProfile
);
router.get("/users", authorize, isAllowed(["admin"]), adminController.getUsers);
router.get(
  "/user/:id",
  authorize,
  isAllowed(["admin"]),
  adminController.getUserById
);
router.put(
  "/user/:id",
  authorize,
  isAllowed(["admin"]),
  validate(updateUserSchema),
  adminController.editUser
);
router.delete(
  "/user/:id",
  authorize,
  isAllowed(["admin"]),
  adminController.deleteUser
);

export default router;
