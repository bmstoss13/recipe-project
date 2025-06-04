import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import recipeRoute from "./routes/recipeRoute.js";
import create from "./routes/create.js";
import authRoute from "./routes/authRoute.js";
import myRecipesRoute from './routes/myRecipesRoute.js';

import OpenAI from "openai"

dotenv.config(); // Load the .env file

const app = express();
const port = 5050;

// use middleware to parse json request bodies
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("What's for Dinner?");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use("/api/auth", authRoute);
app.use("/api/recipes", recipeRoute);
app.use("/create", create);
app.use('/api/my-recipes', myRecipesRoute);


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let messages = [
  { role: "system", content: "You are a helpful assistant." }
];

app.post("/chat", async (req, res) => {
  const { userMessage } = req.body;
  messages.push({ role: "user", content: userMessage });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const botReply = response.choices[0].message.content;
    messages.push({ role: "assistant", content: botReply });

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Error calling OpenAI:", err);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
