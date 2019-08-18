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
]

module.exports = {
    updateInfo
}
