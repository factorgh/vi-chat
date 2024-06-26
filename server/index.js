import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import registerController from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/post.js";
import postRoutes from "./routes/posts.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*Storage configuration */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post(
  "/auth/register",
  upload.single("picture"),
  registerController.register
);

app.post("/posts", verifyToken, upload.single("picture"), createPost);
/*ROUTES */
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use("/posts", postRoutes);
/*MONGO DB CONNECTION*/

mongoose.connect(process.env.MONGODB_URL).then(() => {
  const PORT = 3001;

  app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
  console.log("DATABASE STARTED SUCCESSFULLY ");
});
