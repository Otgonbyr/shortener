import express from "express";
import bp from "body-parser";
import mongoose from "mongoose";
import Url from "./Schema/url.js";
import { nanoid } from "nanoid";
import dotenv from 'dotenv'

const MONGODB_URL = 'mongodb+srv://otgonbayar0503:Hairtai77@oggydata.9wtbmtf.mongodb.net/?retryWrites=true&w=majority'
dotenv.config()

const PORT = 8000;
const app = express();
app.use(bp.json());

app.get("/", async (_, response) => {
  const res = await Url.find();
  response.send(res).end();
});

app.get("/:url", async (request, response) => {
  const { url } = request.params;

  const res = await Url.findOne({
    shortUrl: url,
  });
  response.redirect(res.longUrl);
});

app.post("/", async (request, response) => {
  const { url } = request.body;

  const newUrl = await Url.create({
    longUrl: url,
    shortUrl: nanoid(10),
  });
  response.send({ success: true, url: newUrl }).end();
});

app.delete("/:url", async (request, response) => {
  const { url } = request.params;

  const { acknowledged, deletedCount } = await Url.deleteOne({
    shortUrl: url,
  });
  response.send({ success: acknowledged, removedCount: deletedCount }).end();
});

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGODB_URL);
  } catch (error) {
    console.log("error");
  }
  console.log(`connected to mongodb port: ${PORT}`);
});