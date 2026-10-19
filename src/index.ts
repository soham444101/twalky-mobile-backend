// Must stay first: ES modules evaluate imports in order, so env vars load before server.js reads them.
import "dotenv/config";
import { startServer } from "./server.js";

startServer();
