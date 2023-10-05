import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import dbConnection from "./db/db.js"
const app = express();
const PORT = process.env.PORT || 8800;

import route from "./routes/index.js"

app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

dbConnection()

// routes

app.use(route)


//error middleware
app.use(errorMiddleware);



app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });