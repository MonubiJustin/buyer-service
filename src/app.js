import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";
import { notFound } from "./middleware/notFound.js";
import users from "./routes/userRoute.js";
import orders from "./routes/orderRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import health from "./routes/health.js"

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// set templating engine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




// start database
db();

// endpoints
app.use("/health", health);
app.use("/api/users/", users);
app.use("/api/orders", orders);

// catch all routes not found
app.use(notFound)
// global error handler
app.use(errorHandler)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`buyer-service server running on port: ${PORT}`));