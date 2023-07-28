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

async function generatePages(): Promise<void> {
  const uniqueData: ActivityData[] = [];
  let count = 0;

  while (count < 10) {
    const data = await fetchData();

    
    if (data && !uniqueData.some((item) => item.activity === data.activity)) {
      uniqueData.push(data);
      count++;
    }
  }
  console.log(uniqueData)
  
  for (let i = 0; i < 10; i++) {
    app.get(`/page${i + 1}`, async (req: Request, res: Response) => {
      if (uniqueData[i]) {
        res.send(eta.render("index", { data: uniqueData[i] }));
      } else {
        res.status(500).send("Internal Server Error: Data not available");
      }
    });
  }
}
generatePages();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
