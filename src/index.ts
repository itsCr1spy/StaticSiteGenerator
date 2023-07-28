import express, { Request, Response } from "express";
import path from "path";
import axios from "axios";
import { Eta } from "eta";

const app = express();
const port = 3000;

let viewpath = path.join(__dirname, "views"); 

const etaOptions = {
  views: viewpath,
  cache: true,
  useWith: true
};

const eta: Eta = new Eta(etaOptions);

app.engine("eta", ()=>{
  eta.render
});

app.set("view engine", "eta");

const apiUrl = "https://www.boredapi.com/api/activity";

interface ActivityData {
  activity: string;
  type: string;
  participants: number;
  price: number;
  link: string;
  accessibility: number;
}

async function fetchData(): Promise<ActivityData | null> {
  try {
    const response = await axios.get<ActivityData>(apiUrl);
    return response.data;
  } catch (error:any) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}

app.get("/", async (req: Request, res: Response) => {
  const data = await fetchData();
  res.send(eta.render("index", { data }));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
