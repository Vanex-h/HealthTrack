import Joi from "joi";

export const patientSchema = Joi.object({
    patient_name: Joi.string().required(),
    patient_national_id: Joi.string().required(),
    frequent_sickness: Joi.string().required()
});

export const recordSchema = Joi.object({
    heart_rate: Joi.number().required(),
    body_temprature: Joi.number().required().max(50).min(30),
    patient_id: Joi.number().required(),
    date: Joi.date().required()
});
