export const transValidation = {
    EMAIL_INCORRECT: "Email must be example@email.com",
    GENDER_INCORRECT: "Have something wrong with gender",
    PASSWORD_INCORRECT: "Password must have least 8 characters, include capitalize, lowercase and special characters",
    PASSWORD_CONFIRMATION_INCORRECT: "Password do not match"
}

export const transError = {
    ACCOUNT_IN_USE: "This email have been used",
    ACCOUNT_REMOVE: "This email have been removed from system, please contact to receive support",
    ACCOUNT_NOT_ACTIVE: "This emai do not active, please check your email to verify account"
}

export const transSuccess = {
    USER_CREATED: (email) => {
        return `This account <strong>${email}</strong> have been created but not active, please check your email to verify account`
    }
}
