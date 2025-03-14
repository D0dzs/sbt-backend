import "dotenv/config";
import redisClient from "./redis";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { IForecast } from "../src/interface/IForecastResponse";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

const userRole = async (user: any): Promise<any> => {
  return user?.role;
};

const generateUID = async () => uuidv4();

const generateToken = async (id: string): Promise<string> => {
  const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "45min",
  });

  return accessToken;
};

const generateRefresh = async (id: string): Promise<string> => {
  const refreshToken = jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "5d",
  });

  return refreshToken;
};

const updateRedisForecast = async (URL: string) => {
  console.log(`[Redis/Cache] Updating Redis Forecast at: ${new Date().toUTCString()}`);

  try {
    const response = await fetch(URL);
    const data = (await response.json()) as { result: Record<string, number> };
    const forecastEntries = Object.entries(data.result);
    const ctx: IForecast[] = [];

    forecastEntries.forEach(([timestamp, value]) => {
      const unixTT = new Date(timestamp);
      const epoch = unixTT.getTime();
      ctx.push({ tt: timestamp, epoch, value });
    });

    await redisClient.set("forecast", JSON.stringify(ctx));
  } catch (error) {
    console.warn("Failed to update redis forecast!");
    console.error(error);
  }
};

const getHungaryTime = () => {
  const now = new Date();
  const options = { timeZone: "Europe/Budapest" };
  const hungaryTimeStr = now.toLocaleString("en-US", options);
  const hungaryTime = new Date(hungaryTimeStr);
  return hungaryTime;
};

export { userRole, generateToken, generateRefresh, generateUID, getHungaryTime, updateRedisForecast };
