import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();
import query from "../db/config";
import {
  checkIfTableExistsSql,
  active_driver_table
} from "../utils/dbfunctions";
import ActiveDriver from "../models/activeDrivers";
let today = new Date();
let date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
let time = today.getHours() + ":" + today.getMinutes();
let updateDate = date + " " + time;

router.post("/", (req: Request, res: Response) => {
  if (Object.keys(req.body).length == 0) {
    return res.status(400).json({
      status: false,
      message: `playload expected should have driver_id,lat,lng and status`
    });
  }
  if (!req.body.driver_id) {
    return res.status(400).json({
      status: false,
      message: `driver_id is required`
    });
  }
  if (!req.body.lat) {
    return res.status(400).json({
      status: false,
      message: `lat is required`
    });
  }
  if (!req.body.lng) {
    return res.status(400).json({
      status: false,
      message: `lng is required`
    });
  }
  if (!req.body.status) {
    return res.status(400).json({
      status: false,
      message: `status is required`
    });
  }
  let { driver_id, lat, lng, status } = req.body;
  let activeDriver = new ActiveDriver(driver_id, lat, lng, status, updateDate);
  query(checkIfTableExistsSql(`${active_driver_table}`), (error, data) => {
    if (data.length > 0) {
      query(activeDriver.addDriverActive(), (error, result) => {
        if (!error) {
          return res.status(201).json({
            status: true,
            message: `driver is now activated`
          });
        } else {
          return res.status(400).json({
            status: false,
            message: `An error occured driver not activated`
          });
        }
      });
    } else {
      createTable();
      return res.status(400).json({
        status: false,
        message: `${active_driver_table} doesn't exist create it first`
      });
    }
  });
});

router.get("/", (req: Request, res: Response) => {
  query(ActiveDriver.getAllActiveDrivers(), (error, data) => {
    if (!error) {
      res.status(200).json({
        status: true,
        drivers: data
      });
    } else {
      res.status(400).json({
        status: false,
        message: `An error has occured fetching active Drivers ${error}`
      });
    }
  });
});

router.get("/:driver_id", (req: Request, res: Response) => {
  let driver_id = req.params.driver_id;

  query(ActiveDriver.getAnActiveDrivers(driver_id), (error, data) => {
    if (!error) {
      if (data.length > 0) {
        return res.status(200).json({
          status: true,
          driver: data
        });
      } else {
        return res.status(400).json({
          status: true,
          message: `Driver with id ${driver_id} does not exist`
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: `An error has occured fetching driver`
      });
    }
  });
});

router.put("/:driver_id", (req: Request, res: Response) => {
  let driver_id = req.params.driver_id;
  if (Object.keys(req.body).length == 0) {
    return res.status(400).json({
      status: false,
      message: `playload expected should have driver_id,lat,lng and status`
    });
  }
  if (!req.body.lat) {
    return res.status(400).json({
      status: false,
      message: `lat is required`
    });
  }
  if (!req.body.lng) {
    return res.status(400).json({
      status: false,
      message: `lng is required`
    });
  }
  if (!req.body.status) {
    return res.status(400).json({
      status: false,
      message: `status is required`
    });
  }

  let { lat, lng, status } = req.body;
  let activeDriver = new ActiveDriver(driver_id, lat, lng, status, updateDate);
  query(activeDriver.updateActiveDriver(), (error, resuilt) => {
    if (!error) {
      res.status(200).json({
        status: true,
        message: `Driver status updated successfully`
      });
    } else {
      res.status(400).json({
        status: false,
        message: `An error has occured updating driver ${error}`
      });
    }
  });
});

function createTable() {
  query(ActiveDriver.createActiveDriverTable(), (error, data) => {
    if (!error) {
      console.log("Customers table created successfully");
    } else {
      console.log(`Customer not created ${error}`);
    }
  });
}

export { router as active_driver_router };
