import express, { urlencoded } from "express"
import db from "./db.config.js";
import cors from "cors"
import { getDeduction } from "./utils.js";
import { patientSchema, recordSchema } from "./validation.js";
import morgan from "morgan";

const app = express();
const PORT = 1400;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(morgan("tiny"));

// creating a patient
app.post("/patient", (req, res) => {
    console.log(req.body)

    try {
        const { error } = patientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: `${error.message}`
            });
        }
        const { patient_national_id, patient_name, frequent_sickness } = req.body;
        db.run(
            "INSERT INTO patients (name, national_id, frequent_sickness) values (? , ?, ?)",
            [patient_name, patient_national_id, frequent_sickness],
            (err) => {
                if (err) {
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
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
            data: this
        });
    }
});

app.post("/record", (req, res) => {
    try {
        const createdAt = Date.now()
        const { error } = recordSchema.validate({ ...req.body, date: createdAt });

        if (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: `${error.message}`
            });
        }

        const { heart_rate, body_temprature, patient_id } = req.body;
        const deduction = getDeduction(body_temprature, heart_rate);
        if (!heart_rate || !body_temprature || !patient_id) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required ( heart_rate, body_temprature, patient_id )"
            })
        }

        db.run(
            "INSERT INTO records (patient_id, body_temperature, heart_rate, deduction, date) values( ?, ?, ?, ?, ? )",
            [patient_id, body_temprature, heart_rate, deduction, createdAt],
            (err) => {
                if (err) {
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

app.get("/patient-record/:patient_id", (req, res) => {
    try {
        const patient_id = req.params.patient_id;
        db.all(
            "select * from records join patients where patient_id = ?",
            patient_id,
            function (err, rows) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    patient_id,
                    data: rows
                });
            }
        );
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: this
        });
    }
});

app.get("/all_patients", (req, res) => {
    try {
        db.all("select * from patients", function (err, rows) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            return res.status(201).json({
                success: true,
                data: rows
            })
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            data: this
        })
    }
})

app.delete("/delete_patient/:patient_id", (req, res) => {
    try {
        const id = req.params.patient_id;
        db.run("delete from patients where id = ?", id,
           (err) =>{
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "The patient was deleted successfully"

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
})

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}...............`);
})
