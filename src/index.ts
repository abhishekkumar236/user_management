import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.middleware";
import userRouter from "./routes/user.routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1", userRouter);
app.use(errorHandler);

app.listen(parseInt(process.env.PORT!, 10), () => {
  console.log("Server is running on port: ", process.env.PORT);
});
