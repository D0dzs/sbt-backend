import "dotenv/config";
const PORT = process.env.PORT!;

/*
  This section updates the Redis forecast cache every hour.
*/
import cron from "node-cron";
import { updateRedisForecast } from "../lib/utils";

const API_URL = "https://api.forecast.solar/estimate/watts/47.475498098/19.05333312/0/0/2.1";
cron.schedule("0 */1 * * *", () => updateRedisForecast(API_URL));

/*
  This section sets up the Express server.
*/
import cors from "cors";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.router";
import groupRouter from "./routers/group.router";
import postRouter from "./routers/post.router";
import sponsorRouter from "./routers/sponsor.router";
import subGroupRouter from "./routers/subgroup.router";
import userRouter from "./routers/users.router";
import forecastRouter from "./routers/forecast.router";
import imageRouter from "./routers/imageProvider.router";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/sponsor", sponsorRouter);
app.use("/api/group", groupRouter);
app.use("/api/subgroup", subGroupRouter);
app.use("/api/users", userRouter);
app.use("/api/forecast", forecastRouter);
app.get("/cdn/:path/:filename", imageRouter);

app.get("/api", (req: Request, res: Response) => {
  res.json("OK!");
});

app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));
