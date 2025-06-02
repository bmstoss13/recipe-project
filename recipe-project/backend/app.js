import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config(); // Load the .env file

const app = express();
const port = 5000;

// use middleware to parse json request bodies
app.use(bodyParser.json());


app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
