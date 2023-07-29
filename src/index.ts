import express, { Request, Response } from "express";
import path from "path";
import axios from "axios";
import { Eta } from "eta";

export const app = express();
const port = 3000;

// Set the views directory for templates
let viewpath = path.join(__dirname, "views");

// Configure Eta options
const etaOptions = {
  views: viewpath,
  cache: true,
  useWith: true,
};

const eta: Eta = new Eta(etaOptions);

// Configure Express to use the Eta template engine
app.engine("eta", () => {
  eta.render;
});

app.set("view engine", "eta");

// API URL
const apiUrl = "https://www.boredapi.com/api/activity";

// Interface for the data fetched from the API
interface ActivityData {
  activity: string;
  type: string;
  participants: number;
  price: number;
  link: string;
  accessibility: number;
  key: number;
}

// Function to fetch data from the API
async function fetchData(): Promise<ActivityData | null> {
  try {
    const response = await axios.get<ActivityData>(apiUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

// Function to generate 10 unique pages (build config)
async function generatePages(): Promise<void> {
  const uniqueData: ActivityData[] = [];
  let count = 0;

  // Loop to generate unique data and render pages
  while (count < 10) {
    const data = await fetchData();

    // Check if the fetched data is not null and not already in uniqueData array
    if (data && !uniqueData.some((item) => item.activity === data.activity)) {
      uniqueData.push(data);
      count++;
    }
  }

  // Catch-all route to handle all page requests
  app.get("/:pageId", (req: Request, res: Response) => {
    const pageId = parseInt(req.params.pageId);
    if (!isNaN(pageId) && pageId >= 1 && pageId <= 10 && uniqueData[pageId - 1]) {
      res.send(eta.render("index", { data: uniqueData[pageId - 1] }));
    } else {
      res.status(404).send("Page not found");
    }
  });
}

const rootDir = process.cwd();
// console.log(path.join(rootDir, "public"));
app.use(express.static(path.join(rootDir, "public")));

generatePages();

// Start the Express server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

