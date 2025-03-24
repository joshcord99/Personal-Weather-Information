import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the project root (three levels up from server/src)
const envPath = path.join(
  __dirname,
  "../../../Personal-Weather-Information/.env"
);
console.log("Loading .env file from:", envPath);
console.log("File exists:", existsSync(envPath));
dotenv.config({ path: envPath });
console.log(
  "After dotenv.config - API_KEY:",
  process.env.API_KEY ? "Present" : "Missing"
);
console.log(
  "After dotenv.config - API_BASE_URL:",
  process.env.API_BASE_URL || "Not set"
);

// Import the routes
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../../../client/dist")));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
