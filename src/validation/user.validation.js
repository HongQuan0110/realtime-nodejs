import { check } from "express-validator";
import { transValidation } from "../../lang/en";

let updateInfo = [
    check("username", transValidation.UPDATE_USERNAME)
        .optional()
        .isLength({min: 3, max: 17})
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check("gender", transValidation.UPDATE_GENDER)
        .optional()
        .isIn(["male", "female"]),
    check("address", transValidation.UPDATE_ADDRESS)
        .optional()
        .isLength({min: 3, max: 30}),
    check("phone", transValidation.UPDATE_PHONE)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)
];

let updatePassword = [
    check("currentPassword", transValidation.PASSWORD_INCORRECT)
        .isLength({min: 8})
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("newPassword", transValidation.PASSWORD_INCORRECT)
        .isLength({min: 8})
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("confirmPassword", transValidation.PASSWORD_CONFIRMATION_INCORRECT)
        .custom((val, {req}) => val === req.body.newPassword)
]

module.exports = {
    updateInfo,
    updatePassword
}
