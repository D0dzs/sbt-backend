import { getHungaryTime } from "../../lib/utils";
import { Request, Response } from "express";
import redisClient from "../../lib/redis";
import { IForecast } from "../interface/IForecastResponse";

const getLatestForecast = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentTime = new Date().getTime();
    const hungaryTime = getHungaryTime().getTime();
    const forecastCache = await redisClient.get("forecast");
    if (!forecastCache)
      return res.status(404).json({ error: "Forecast not found!", value: "N/A", tt: null, epoch: currentTime });

    const parsedForecastCache = (await JSON.parse(forecastCache)) as IForecast[];
    if (!parsedForecastCache)
      return res.status(404).json({ error: "Forecast not found!", value: "N/A", tt: null, epoch: currentTime });

    const latestForecast = parsedForecastCache
      .filter((forecast: IForecast) => forecast.epoch <= hungaryTime)
      .reverse()[0];

    if (!latestForecast)
      return res.status(404).json({ error: "Forecast not found!", value: "N/A", tt: null, epoch: currentTime });

    return res.status(200).json({ tt: latestForecast.tt, value: latestForecast.value, epoch: latestForecast.epoch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error", value: "N/A", tt: undefined, epoch: undefined });
  }
};

export { getLatestForecast };
