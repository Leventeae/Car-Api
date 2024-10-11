import express from "express";
import { handleErrors } from "../middleware/error/ErrorHandler";
import fs from "fs";

const router = express.Router();

const readJson = async (path: string): Promise<any> => {
  try {
    const data = await fs.promises.readFile(require.resolve(path), "utf8");
    return JSON.parse(data).Cars;
  } catch (err) {
    console.error("Error reading JSON file:", err);
    throw err;
  }
};

let cars: any = null;

readJson("../services/car_data.json")
  .then((data) => {
    cars = data;
  })
  .catch((err) => {
    console.error("Failed to load car data:", err);
  });

router.get("/", (req, res) => {
  const { brand, fuel_type, type, horsepower, color, price } = req.query;

  let filteredCars = cars;
  if (brand) {
    filteredCars = filteredCars.filter((car: any) => car.brand === brand);
  }
  if (fuel_type) {
    filteredCars = filteredCars.filter((car: any) => car.fuel_type === fuel_type);
  }
  if (type) {
    filteredCars = filteredCars.filter((car: any) => car.type === type);
  }
  if (horsepower) {
    filteredCars = filteredCars.filter((car: any) => car.horsepower >= horsepower);
  }
  if (color) {
    filteredCars = filteredCars.filter((car: any) => car.color === color);
  }
  if (price) {
    filteredCars = filteredCars.filter((car: any) => car.price <= price);
  }
  res.status(200).json({ message: "successful", cars: filteredCars });
});

router.use(handleErrors);

export const FilterRouter = router;
