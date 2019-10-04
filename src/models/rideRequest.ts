import { ride_request_table } from "../utils/dbfunctions";

export default class RideRiquest {
  constructor(
    public customer_id: string,
    public request_time: string,
    public pick_up_lat: string,
    public pick_up_lng: string,
    public pick_up_time: string,
    public drop_off_lat: string,
    public drop_off_lng: string,
    public drop_off_time: string,
    public request_status: string
  ) {}
  static getRideRequestTableCreationSql() {
    return `CREATE TABLE IF NOT EXISTS ${ride_request_table} (
            request_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id VARCHAR(255),
            request_time VARCHAR(255),
            pick_up_lat VARCHAR(255),
            pick_up_lng VARCHAR(255),
            pick_up_time VARCHAR(255),
            drop_off_lat VARCHAR(255),
            drop_off_lng VARCHAR(255),
            drop_off_time VARCHAR(255),
            request_status VARCHAR(255),            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
  }
  insertRideRequestSql() {
    return `INSERT INTO ${ride_request_table}(customer_id,request_time,pick_up_lat,pick_up_lng,pick_up_time,drop_off_lat,drop_off_lng,drop_off_time,request_status)\
        VALUES('${this.customer_id}','${this.request_time}','${this.pick_up_lat}','${this.pick_up_lng}','${this.pick_up_time}','${this.drop_off_lat}','${this.drop_off_lng}','${this.drop_off_time}','${this.request_status}')`;
  }
  static getAllRideRequests() {
    return `SELECT * FROM ${ride_request_table}`;
  }
  static getRideRequestsByRequestId(request_id: number) {
    return `SELECT * FROM ${ride_request_table} WHERE request_id= ${request_id}`;
  }
  static getRideRequestsById(customer_id: number) {
    return `SELECT * FROM ${ride_request_table} WHERE customer_id= ${customer_id}`;
  }
  static getRideRequestBetweenTime(startTime: string, endTime: string) {
    return `SELECT * FROM ${ride_request_table} WHERE request_time BETWEEN ('${startTime}'  AND '${endTime}';`;
  }
}
