const { sendOtp,  getOtpForm } = require('./otp')


module.exports = {

    checkAccountVerifiedInIndex: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isVerified) {
                next()
            }
            else {
                return getOtpForm(req, res)
            }
        } else {
            next()
        }
    }
}
