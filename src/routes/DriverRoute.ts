import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();
import query from "../db/config";
import Driver from "../models/driver";
import bcrpt from "bcrypt";
import {
  hashSalt,
  checkIfTableExistsSql,
  driver_table
} from "../utils/dbfunctions";

// student registration
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  let body = req.body;
  bcrpt.hash(body.password, hashSalt).then(
    hashedPassword => {
      let driver = new Driver(
        body.first_name,
        body.last_name,
        body.phone_number,
        body.gender,
        body.email_address,
        body.licence_number,
        body.status,
        body.id_number,
        hashedPassword
      );
      query(driver.getAddDriverSql(), (error, data) => {
        if (error) {
          if ((error.code = "ER_NO_SUCH_TABLE")) {
            res.status(400).json({
              status: false,
              message: `Driver Registration failed Try again ${error}`
            });
            query(Driver.getDriverTableCreationSql(), (error, data) => {});
          } else {
            return res.status(400).json({
              status: false,
              message: "Driver Registration failed0" + error.code
            });
          }
        } else {
          return res.status(201).json({
            status: true,
            message: "Driver added Successfully",
            student_id: data.insertId
          });
        }
      });
    },
    error => {
      console.log(`An error has occoured hashing password ${error}`);
    }
  );
});

// retrives all drivers
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  query(checkIfTableExistsSql(`${driver_table}`), (error, data) => {
    if (data.length > 0) {
      query(Driver.getAllDriversSql(), (error, data) => {
        if (error) {
          return res.status(400).json({
            status: false,
            message: "an error has occured" + error.code
          });
        } else {
          if (data.length > 0) {
            return res.status(200).json({
              status: true,
              no_of_drivers: data.length,
              drivers: data
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "No Driver Found"
            });
          }
        }
      });
    } else {
      res.status(400).json({
        status: false,
        message: `No Drivers found Table ${driver_table} Doesn't exist`
      });
    }
  });
});

// search for Driver with either name, id number, mobile number or pdl number
router.get("/:driver_id", (req: Request, res: Response, next: NextFunction) => {
  const driver_id = req.params.driver_id;
  query(checkIfTableExistsSql(`${driver_table}`), (error, data) => {
    if (data.length > 0) {
      query(Driver.getDriverByIdSql(driver_id), (error, data) => {
        console.log(data.length, error, driver_id);
        if (!error) {
          if (data.length > 0) {
            return res.status(200).json({
              status: true,
              driver: data
            });
          } else {
            return res.status(200).json({
              status: false,
              message: `No Driver Found with id ${driver_id}`
            });
          }
        } else {
          return res.status(400).json({
            status: false,
            driver: driver_id,
            message: `An Error Has occured ${error.code}`
          });
        }
      });
    } else {
      res.status(400).json({
        status: false,
        message: `No Driver Found ${error}`
      });
    }
  });
});

// updating  driver account
router.patch(
  "/:driverId",
  (req: Request, res: Response, next: NextFunction) => {
    let driverId = req.params.driverId;
    res.status(200).json({
      message: "updating  driver details",
      driverId
    });
  }
);

// delete driver account
router.delete(
  "/:driverId",
  (req: Request, res: Response, next: NextFunction) => {
    let driverId = req.params.driverId;
    query(Driver.getDriverDeleteByIdSql(driverId), (error, data) => {
      if (!error) {
        return res.status(200).json({
          status: true,
          message: `Successfully Deleted user ${driverId}`
        });
      } else {
        return res.status(200).json({
          status: false,
          message: `Unable to Deleted user ${driverId}`
        });
      }
    });
  }
);

export { router as driver_route };
