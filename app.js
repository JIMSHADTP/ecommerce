require("dotenv").config()
const createError = require("http-errors");
const AxiosError = require('axios-error');
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require('connect-flash');
const passport = require("passport");
const session = require("express-session")
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const userModel = require("./models/userModel");
const dbConnection = require("./config/dbConnection");

const app = express();
dbConnection.mongoose()

app.set("view engine", "ejs");
app.set("layout","layout/layout")
app.set("layout extractScripts", true)


// view engine setup
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session
app.use(session({
  secret:"secretkey",
  resave:false,
  saveUninitialized:false
}))
app.use(flash());

//cache
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, no-store');
  next();
});

//passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(userModel.createStrategy())
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())
app.use((req,res,next)=>{
  if(req.isAuthenticated()){
    res.locals.user = true
    res.locals.username = req.user.name
    res.locals.userId = req.user.id
  }
  next()
})

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
 });

module.exports = app;
