import { getHungaryTime, memoizedForecast } from "../../lib/utils";
import { Request, Response } from "express";
import { ResponseFormat } from "../interface/IForecastResponse";

const API_URL = "https://api.forecast.solar/estimate/watts/47.475498098/19.05333312/0/0/2.1";

const getLatestForecast = async (req: Request, res: Response): Promise<any> => {
  const currentDate = new Date();
  const hungaryTime = getHungaryTime().getTime();

  try {
    const response = await memoizedForecast(API_URL);

    // We're asserting the structure of the API response
    const data: { result: Record<string, number> } = response as any;
    const forecastEntries = Object.entries(data.result);
    const ctx: ResponseFormat[] = [];

    forecastEntries.forEach(([timestamp, value]) => {
      const unixTT = new Date(timestamp);
      const epoch = unixTT.getTime();
      if (unixTT.getUTCDate() === currentDate.getUTCDate()) {
        ctx.push({ epoch, value });
      }
    });

    const latestForecast = ctx.filter((value) => value.epoch <= hungaryTime).reverse()[0];
    if (!latestForecast) {
      return res
        .status(429)
        .json({ message: "We are unable to fetch the latest forecast!", epoch: hungaryTime, value: "N/A" });
    } else {
      return res.status(200).json(latestForecast);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", epoch: hungaryTime, value: "N/A" });
  }
};

export { getLatestForecast };
