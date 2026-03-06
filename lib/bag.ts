// In production, install from npm and import directly:
//   npm install @tbagtapp/sdk
//   import { Bag } from "@tbagtapp/sdk"
//
// For this sample app, we use a local copy of the SDK dist.
import { Bag } from "./sdk/index.js";

export const bag = new Bag({
  apiKey: process.env.BAG_API_KEY!,
  baseUrl: process.env.BAG_BASE_URL,
});
