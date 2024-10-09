import express from "express";
import { handleErrors } from "../middleware/error/ErrorHandler";
import fs from "fs";

const router = express.Router();

const readJson = async (path: string): Promise<any> => {
  try {
    const data = await fs.promises.readFile(require.resolve(path), "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    throw err;
  }
};

let cars: any;

readJson("../services/car_data.json")
  .then((data) => {
    cars = data;
  })
  .catch((err) => {
    console.error("Failed to load car data:", err);
  });

router.get("/", (req, res) => {
  res.status(200).json({ message: "successful", cars });
});

router.use(handleErrors);

export const MainRouter = router;
