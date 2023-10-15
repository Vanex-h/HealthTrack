import express from "express"
import db from "./db.config.js";

const app = express();
const PORT= 1400;

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to my server"
    });
});

// creating a patient
app.post("/patient", (req, res) => {
    try {
        const { patient_national_id, patient_name } = req.body;
        db.run(
            "INSERT INTO patients (name, national_id) values (? , ?)",
            [patient_name, patient_national_id],
            (err) => {
                if ( err ) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "Patient created successfully",
                    data: this
                });
            }
        )
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
})

app.listen(PORT, ()=>{
    console.log("The server is a sprinter...............");
})