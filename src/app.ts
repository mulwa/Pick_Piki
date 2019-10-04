import express, { Application, Request, Response, NextFunction } from "express";
import { driver_route } from "./routes/DriverRoute";
import { customer_route } from "./routes/customerRouter";
import bodyParser from "body-parser";
import { ride_request_route } from "./routes/rideRequest_Route";
import { active_driver_router } from "./routes/active_driver_router";

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling CORS Cross Origin Reource Sharing
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use("/driver", driver_route);
app.use("/customer", customer_route);
app.use("/rideRequest", ride_request_route);
app.use("/activeDriver", active_driver_router);

// handling  error for wrong endpoint
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("End point Not  Found");
  res.status(400);
  next(error);
});
// app.use((req,res,next)=>{
//     res.status(error.status || 500);
//     res.json({
//         error: error.message
//     });
// })
export { app as default };
