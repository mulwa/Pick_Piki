import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();
import query from "../db/config";
import RideRequest from "../models/rideRequest";
import {
  checkIfTableExistsSql,
  ride_request_table
} from "../utils/dbfunctions";

// adds ride requests
router.post("/", (req: Request, res: Response) => {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes();
  let request_time = date + " " + time;
  console.log(request_time);
  let {
    customer_id,
    pick_up_lat,
    pick_up_lng,
    pick_up_time,
    drop_off_lat,
    drop_off_lng,
    drop_off_time,
    request_status
  } = req.body;
  let rideRequest = new RideRequest(
    customer_id,
    request_time,
    pick_up_lat,
    pick_up_lng,
    pick_up_time,
    drop_off_lat,
    drop_off_lng,
    drop_off_time,
    request_status
  );
  query(checkIfTableExistsSql(`${ride_request_table}`), (error, results) => {
    if (results.length == 0) {
      createRideRequestTable();
    }
    query(rideRequest.insertRideRequestSql(), (error, data) => {
      if (!error) {
        return res.status(201).json({
          status: true,
          message: "Ride Request added successfully",
          data: rideRequest
        });
      } else {
        return res.status(400).json({
          status: false,
          message: `An error has occured ${error}`
        });
      }
    });
  });
});

// retrive all request
router.get("/", (req: Request, res: Response) => {
  query(checkIfTableExistsSql(`${ride_request_table}`), (error, data) => {
    if (data.length == 0) {
      createRideRequestTable();
      return res.status(400).json({
        status: false,
        message: `No ride request Found ${error}`
      });
    } else {
      query(RideRequest.getAllRideRequests(), (error, result) => {
        if (!error) {
          if (result.length > 0) {
            return res.status(200).json({
              status: true,
              total_requests: result.length,
              ride_requests: result
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "No Ride request found"
            });
          }
        } else {
          return res.status(400).json({
            status: false,
            message: `An error has occured ${error}`
          });
        }
      });
    }
  });
});

// retrieve ride request between two dates
router.post("/ridesBetweenDates/", (req: Request, res: Response) => {
  let { startTime, endTime } = req.body;
  if (Object.keys(req.body).length == 0) {
    return res.status(400).json({
      status: false,
      message: "expected startTime and EndTime parameters"
    });
  }
  query(
    RideRequest.getRideRequestBetweenTime(startTime, endTime),
    (error, result) => {
      if (error) {
        return res.status(400).json({
          status: false,
          message: `An error has occured try again later ${error}`
        });
      }
      if (result.length == 0) {
        return res.status(200).json({
          status: true,
          message: `There is no ride riquest found betwee ${startTime} and ${endTime}`
        });
      } else {
        return res.status(200).json({
          status: true,
          rideRequest: result
        });
      }
    }
  );
});

function createRideRequestTable() {
  query(RideRequest.getRideRequestTableCreationSql(), (error, data) => {
    if (!error) {
      console.log("Customers table created successfully");
    } else {
      console.log(`Customer not created ${error}`);
    }
  });
}
export { router as ride_request_route };
