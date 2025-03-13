import "dotenv/config";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const userRole = async (user: any): Promise<any> => {
  return user?.role;
};

const generateUID = async () => uuidv4();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

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

/*
 * Prefetch the forecast data
 */
import memoizee from "memoizee";

const memoizedForecast = memoizee(
  async (URL: string) => {
    // console.log(`[DEBUG] Cache miss - Fetching from endpoint: ${URL}`);
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  },
  {
    promise: true,
    maxAge: 1.01 * 60 * 60 * 1000,
    preFetch: 1,
    normalizer: () => {
      const now = new Date();
      const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      // console.log(`[DEBUG] Normalizer called, cache key: ${key}`);
      return key;
    },
    // dispose: (value: any) => {
    // console.log(`[DEBUG] Cache entry expired`);
    // },
    resolvers: [
      function (result) {
        // console.log("[DEBUG] Cache hit - Using cached result");
        return result;
      },
    ],
  },
);

const getHungaryTime = () => {
  const now = new Date();
  const options = { timeZone: "Europe/Budapest" };
  const hungaryTimeStr = now.toLocaleString("en-US", options);
  const hungaryTime = new Date(hungaryTimeStr);
  return hungaryTime;
};

export { userRole, generateToken, generateRefresh, generateUID, memoizedForecast, getHungaryTime };
