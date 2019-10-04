import express, { Application, Request, Response, NextFunction } from "express";
import bcrpt from "bcrypt";
import config from "config";
const router = express.Router();
import query from "../db/config";
import customer from "../models/customer";
import {
  checkIfTableExistsSql,
  customer_table,
  hashSalt
} from "../utils/dbfunctions";
import Customer from "../models/customer";

// adds new branch
router.post("/", (req: Request, res: Response) => {
  let body = req.body;
  bcrpt.hash(body.password, hashSalt).then(
    hashedPassword => {
      let customer = new Customer(
        body.first_name,
        body.last_name,
        body.email_address,
        body.phone_number,
        hashedPassword
      );
      query(checkIfTableExistsSql(`${customer_table}`), (error, data) => {
        if (data.length > 0) {
          // insert data cause table exists
          query(customer.addcustomerSql(), (error, data) => {
            if (!error) {
              return res.status(201).json({
                status: true,
                message: " successfully Registered"
              });
            } else {
              return res.status(201).json({
                status: false,
                message: "Customers Details Not added" + error.code
              });
            }
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Customers table Does not Exists"
          });
          // create branch table
          createCustomerTable();
        }
      });
    },
    error => {
      console.log(`An Error has occured hashing your password ${error}`);
    }
  );
});
// gets all customers
router.get("/", (req: Request, res: Response) => {
  query(checkIfTableExistsSql(`${customer_table}`), (error, data) => {
    if (error) {
      console.log("An error has occured" + error);
      return res.status(400).json({
        status: false,
        message: error.sqlMessage
      });
    }
    if (data.length > 0) {
      query(Customer.getAllCustomersSql(), (error, data) => {
        if (!error) {
          if (data.length > 0) {
            return res.status(200).json({
              status: true,
              customers: data
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "No Customer found"
            });
          }
        }
      });
    } else {
      // create datable
      createCustomerTable();
      return res.status(200).json({
        status: false,
        message: "No Customer details found and table does not exist"
      });
    }
  });
});

// gets one customer details
router.get("/:customer_id", (req: Request, res: Response) => {
  let customer_id = req.params.customer_id;
  query(Customer.getCustomerById(customer_id), (error, data) => {
    if (!error) {
      if (data.length > 0) {
        return res.status(200).json({
          status: true,
          customer: data
        });
      } else {
        return res.status(200).json({
          status: true,
          message: `No customer found with id ${customer_id}`
        });
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "An error has Occured" + error
      });
    }
  });
});

router.delete("/:customer_id", (req: Request, res: Response) => {
  let customer_id = req.params.customer_id;
  query(Customer.getDeleteCustomerById(customer_id), (error, data) => {
    if (!error) {
      return res.status(200).json({
        status: true,
        message: "Customer Deleted Successfully"
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Unable to delete Customer details" + error.code
      });
    }
  });
});

function createCustomerTable() {
  query(Customer.createCustomerTableSql(), (error, data) => {
    if (!error) {
      console.log("Customers table created successfully");
    } else {
      console.log(`Customer not created ${error}`);
    }
  });
}

export { router as customer_route };
