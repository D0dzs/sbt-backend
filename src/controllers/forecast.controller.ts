import { getHungaryTime } from "../../lib/utils";
import { Request, Response } from "express";
import { ResponseFormat } from "../interface/IForecastResponse";
import redisClient from "../../lib/redis";

const getLatestForecast = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentDate = new Date();
    const hungaryTime = getHungaryTime().getTime();
    const forecastCache = await redisClient.get("forecast");

    const data: { result: Record<string, number> } = forecastCache as any;
    const forecastEntries = Object.entries(data.result);
    const ctx: ResponseFormat[] = [];

    forecastEntries.forEach(([timestamp, value]) => {
      const unixTT = new Date(timestamp);
      const epoch = unixTT.getTime();
      if (unixTT.getUTCDate() === currentDate.getUTCDate()) {
        ctx.push({ tt: timestamp, epoch, value });
      }
    });

    const latestforecast = ctx.filter((value) => value.epoch <= hungaryTime).reverse()[0];
    if (!latestforecast)
      return res.status(404).json({ error: "Forecast not found", value: "N/A", tt: undefined, epoch: undefined });

    return res.status(200).json({ tt: latestforecast.tt, value: latestforecast.value, epoch: latestforecast.epoch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error", value: "N/A", tt: undefined, epoch: undefined });
  }
};

export { getLatestForecast };
