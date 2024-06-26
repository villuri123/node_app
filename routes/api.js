let express = require('express');
const Admin = require('../controllers/AdminController');
const Api=require("../controllers/ApiController");
const { basicRequestAuth } = require('../utils/auth');
let router = express.Router();

// Admin login
router.post("/login",Admin.adminLogin);
// forgot password page
router.get('/forgot-password',Admin.forgotPasswordPage);
// change password
router.get('/change-password',Admin.ChangePassword);
// forgot password to update otp
router.post("/forgot-password",Admin.forgotPassword);
// verify otp
router.post("/verify-otp",Admin.verifyOtp);
//reset password
router.get("/reset-password",Admin.resetPasswordPage);
router.post("/reset-password",Admin.resetPassword);

// api for mobile view
router.post("/signup",Api.signUp);
router.post("/school-login",Api.login);
router.get("/about-us",basicRequestAuth,Api.aboutUs);
router.get("/fee-structure",basicRequestAuth,Api.feeStructure);
router.get("/facilities",basicRequestAuth,Api.facilities);
router.get("/gallery",basicRequestAuth,Api.gallery);
router.get("/testimonials",basicRequestAuth,Api.testimonials);
router.post("/add-gallery",basicRequestAuth,Api.addGallery);

//schools
router.get("/schools",basicRequestAuth,Api.schools);
router.post("/get-schools", basicRequestAuth,Api.getSchoolById);

module.exports = router;