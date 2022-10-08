const nodemailer = require("nodemailer")
const userModel = require('../models/userModel')
const categoryModel = require('../models/categoryModel');
const { all } = require("../routes");


function generateOtp() {
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log("generated otp :" + otp);
    return otp
}

function hideEmail(target) {
    let email = target
    let hiddenEmail = "";
    for (i = 0; i < email.lenght; i++) {
        if (i > 2 && i < email.indexOf("@")) {
            hiddenEmail += "*";
        } else {
            hiddenEmail += email[i];

        }
    }
    return hiddenEmail
}

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 456,
    secure: true,
    service: "Gmail",

    auth : { 
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASSWORD,
    }
})

const otpVerification = async (req,res) => {
    let enteredOtp = Number(req.body.a + req.body.b + req.body.c + req.body.d + req.body.e + req.body.f )
    try{
    if(req.user.otp === enteredOtp) {
        await userModel.findByIdAndUpdate(req.user.id, { isVerified : true })
   
        res.redirect("/")
    }else {

        const hiddenEmail = hideEmail(req.user.email)
    
        res.render("otpValidationForm", {
            email : hiddenEmail,

        })
    }
    }catch (err) {
        console.log(err);
        res.redirect("/signup")
    }
}

const getOtpForm = async (req,res) => {
    try {
       
        // const allCategories = await categoryModel.find()
        const hiddenEmail = hideEmail(req.user.email)
        res.render("otpValidationForm" ,{
            email : hiddenEmail,
            // allCategories : allCategories
        })
    } catch (error) {
        console.log(error);
        res.redirect("/")
        
    }
}

const sendOtp = async (req, res) => {
    let otp = generateOtp()
    try {
    await userModel.findByIdAndUpdate(req.user.id, {otp : otp })
        let info = await transporter.sendMail({
            to: req.user.email,
            subject: "otp for registration is :",
            html: "<h3>OTP for account verification is <h3>" + "<h1 style ='font-weight:bold;'>" + otp + "</h1>"
        });

        console.log("message sent : %s", info.messageId);

    } catch (error) {
        console.log(error);
        res.redirect("/signup")
    }
}

module.exports = { 
    sendOtp,
    otpVerification,
    getOtpForm
}