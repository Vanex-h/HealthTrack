import express from "express"
import db from "./db.config.js";
import morgan from "morgan";
import cors from "cors"
import { getDeduction } from "./utils.js";

const app = express();
const PORT= 1400;

app.use(express.json()).use(morgan("tiny")).use(cors());

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to my server"
    });
});

// creating a patient
app.post("/patient", (req, res) => {
    try {
        const { patient_national_id, patient_name, frequent_sickness } = req.body;
        db.run(
            "INSERT INTO patients (name, national_id, frequent_sickness) values (? , ?, ?)",
            [patient_name, patient_national_id, frequent_sickness],
            (err) => {
                if ( err ) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "Patient created successfully"
                });
            }
        )
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: this
        });
    }
});

app.post("/record", (req,res) => {
    try {
        const { heart_rate, body_temprature, patient_id } = req.body;
        const deduction = getDeduction(body_temprature, heart_rate);
        if ( !heart_rate || !body_temprature || !patient_id) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required ( heart_rate, body_temprature, patient_id )"
            })
        }

        db.run(
            "INSERT INTO records (patient_id, body_temperature, heart_rate, deduction) values( ?, ?, ?, ? )",
            [patient_id, body_temprature, heart_rate, deduction],
            (err) => {
                if ( err ) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "Record created successfully"
                });
            }
        )
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: this
        });
    }
});

app.get("/patient-record/:patient_id", (req,resp)=>{
    
})

app.listen(PORT, ()=>{
    console.log("The server is a sprinter...............");
})