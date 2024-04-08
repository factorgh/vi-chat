import {
  addRemoveFriend,
  getUser,
  getUserFriends,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friend", getUserFriends);

router.patch("/:id/:friendId", addRemoveFriend);

export default router;
