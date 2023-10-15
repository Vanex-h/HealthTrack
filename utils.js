export function getDeduction(body_temperature, heart_rate) {
    let deduction = "";
    if (body_temperature < 37.0) {
      deduction = "Body temperature is too low. ";
    } else if (body_temperature > 42.5) {
      deduction = "Body temperature is too high. ";
    }
    if (heart_rate < 60) {
      deduction += "Heart rate is too low. ";
    } else if (heart_rate > 100) {
      deduction += "Heart rate is too high. ";
    }
    if (!deduction) {
      deduction = "No deduction";
    }
    return deduction;
}