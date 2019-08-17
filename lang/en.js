export const transValidation = {
    EMAIL_INCORRECT: "Email must be example@email.com",
    GENDER_INCORRECT: "Have something wrong with gender",
    PASSWORD_INCORRECT: "Password must have least 8 characters, include capitalize, lowercase and special characters",
    PASSWORD_CONFIRMATION_INCORRECT: "Password do not match"
}

export const transError = {
    ACCOUNT_IN_USE: "This email have been used",
    ACCOUNT_REMOVE: "This email have been removed from system, please contact to receive support",
    ACCOUNT_NOT_ACTIVE: "This emai do not active, please check your email to verify account",
    TOKEN_UNDEFINED: "Invalid token",
    LOGIN_FAILED: "Wrong account or password",
    SERVER_ERROR: "Internal server error",
    AVATAR_TYPE: "File not match, allow png, jpg and jpeg",
    AVATAR_SIZE: "Upload image limit 1MB"
}

export const transSuccess = {
    USER_CREATED: (email) => {
        return `This account <strong>${email}</strong> have been created but not active, please check your email to verify account`
    },
    ACCOUNT_ACTIVE: "This account is active, your can login into system",
    LOGIN_SUCCESS: (username) => {
        return `Hello ${username}, have a good day`
    },
    LOGOUT_SUCCESS: "Logout success, see you again!",
    AVATAR_UPDATED: "Update avatar success"
}

export const transMail = {
    SUBJECT: "Awesome Chat: Verify account",
    TEMPLATE: (linkVerify) => {
        return `
            <h2>Your receive this email to verify your account on Awesome Chat</h2>
            <h3>Please click to link below to active your account</h3>
            <h3><a href="${linkVerify}"></a>${linkVerify}</h3>
            <h4>if have something wrong, please skip this email</h4>
        `
    },
    SEND_FAILED: "Something wrong happen, please contact us to receive support"
}
