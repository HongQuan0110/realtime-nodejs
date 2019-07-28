import { check } from "express-validator";
import { transValidation } from "../../lang/en";

let register = [
    check("email", transValidation.EMAIL_INCORRECT)
        .trim().isEmail(),
    check("gender", transValidation.GENDER_INCORRECT)
        .isIn(["male", "female"]),
    check("password", transValidation.PASSWORD_INCORRECT)
        .isLength({min: 8}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("password_confirmation", transValidation.PASSWORD_CONFIRMATION_INCORRECT)
        .custom((val, {req}) => {
            return val === req.body.password;
        })
]

module.exports = {
    register
}
