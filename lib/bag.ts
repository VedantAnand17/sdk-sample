import { Bag } from "@tbagtapp/sdk";

export const bag = new Bag({
  apiKey: process.env.BAG_API_KEY!,
  baseUrl: process.env.BAG_BASE_URL,
});
