import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import recipeRoute from "./routes/recipeRoute.js";

dotenv.config(); // Load the .env file

const app = express();
const port = 5000;

// use middleware to parse json request bodies
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send("What's for Dinner?");
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/recipes', recipeRoute);

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
