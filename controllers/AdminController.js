const bcrypt = require('bcrypt');
const saltRounds = 10;
const validator = require('validator');
const schools = require('../models/schools');
const adminUsers = require('../models/adminUsers');
const aboutUs = require('../models/aboutUs');
const facilities = require('../models/facilities');
const gallery = require('../models/gallery');
const testiminials = require('../models/testimonials');
const feeStructure = require('../models/feeStructure');
const { getJWTToken } = require('../utils/jwt');
const jwt = require("jsonwebtoken");
const { getDateTime } = require('../utils/dateTime');
const path = require('path');
const fs = require('fs');
const transporter = require('../nodemailer/nodemailer');
const mobileRegex = /^[6789]\d{9}$/;
var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
module.exports = {
    index: async function (req, res) {
        res.render("");
    },
    // schools
    addSchool: async function (req, res) {
            try {
                let schoolName = req.body.schoolName;
                let address = req.body.address;
                let email = req.body.email;
                let phone = req.body.phone;
                let hostel = req.body.hostel;
                let principleName = req.body.principleName;
                let noOfStudents = req.body.noOfStudents;
                let noOfTeachers = req.body.noOfTeachers;
                let educationType = req.body.educationType;
                let educationLevel = req.body.educationLevel;
                let establishedDate = req.body.establishedDate;
                let website = req.body.website;
                let description = req.body.description;
                let date = getDateTime();
                if (!schoolName) {
                    throw new Error("Enter school name");
                }
                if (!address) {
                    throw new Error("Enter address");
                }
                if (!email) {
                    throw new Error("Enter email");
                }
                if (!phone) {
                    throw new Error("Enter phone number");
                }
                if (!hostel) {
                    throw new Error("Enter hostel status");
                }
                if (!principleName) {
                    throw new Error("Enter principle name");
                }
                if (!noOfStudents) {
                    throw new Error("Enter number of students in school");
                }
                if (!noOfTeachers) {
                    throw new Error("Enter number of teachers in school");
                }
                if (!educationType) {
                    throw new Error("Enter education type eg:state,CBSE,ICSE");
                }
                if (!educationLevel) {
                    throw new Error("Enter education level");
                }
                if (!establishedDate) {
                    throw new Error("Enter established date eg:2022-12-22");
                }
                if (!website) {
                    throw new Error("Enter school website");
                }
                if (!description) {
                    throw new Error("Enter description");
                }
                const emailExists = await schools.checkEmailExists(email);
                if (emailExists) {
                    throw new Error("This email already exist");
                }
                if (!emailRegex.test(email)) {
                    throw new Error("Enter valid email")
                }
                if (!mobileRegex.test(phone)) {
                    throw new Error("Enter valid mobile number")
                }
                const schoolExists = await schools.checkSchoolExists(schoolName);
                if (schoolExists) {
                    throw new Error("This school already exist");
                }
                let schoolData = {
                    school_name: schoolName,
                    address: address,
                    email: email,
                    phone: phone,
                    hostel: hostel,
                    principle_name: principleName,
                    no_of_students: noOfStudents,
                    no_of_teachers: noOfTeachers,
                    education_type: educationType,
                    education_level: educationLevel,
                    established_date: establishedDate,
                    website: website,
                    description: description,
                    created_at: date,
                    updated_at: date
                };
                let password = req.body.password;
                if(password.length < 6){
                    throw new Error("Password must be more than 5 digits")
                }
                let hashpassword = bcrypt.hashSync(password, saltRounds)
                schools.saveSchoolRegistration(schoolData).then(response => {
                    let data = {
                        school_id: response.schoolId,
                        email: email,
                        password: hashpassword,
                        user_role: 3,
                        user_scope: "user_login",
                        status: 2,
                        created_at: date,
                        updated_at: date
                    }
                    adminUsers.saveData(data).then(response => {
                        res.json(response)
                    })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            }
            catch (error) {
                res.status(200).json({ success: false, message: error.message })
            }
        },
    schoolsList: async function (req, res) {
        
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===3){
            res.redirect('/')
        }else{
            let schoolList = await schools.getSchoolRecords();
            res.render("admin/schools", { schoolList: schoolList, page: "schools", token: decoded, title: "schools" });
        }
    },
    adminLogin: async function (req, res) {
        try {
            let user_name = req.body.user_name;
            let password = req.body.password;
            if (!validator.isEmail(user_name)) {
                throw new Error("Invalid email");
            }
            if (!password) {
                throw new Error("Invalid password");
            }
            let user = await adminUsers.getUserByEmail(user_name);
            let userRole = user.user_role;
            let schoolId = user.school_id;
            let userId = user.user_id;
            if (!user) {
                throw new Error("User not found");
            }
            console.log(password, user)
            const isvalid = bcrypt.compareSync(password, user.password);
            if (!isvalid) {
                throw new Error(" Password incorrect");
            }
            const token = await getJWTToken(user);
            console.log(token)
            res.status(200).cookie('access_token', 'Bearer ' + token, {
                user: await adminUsers.updateTokenForAdminUser(user_name, token),
                expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 1 hours
                signed: true,
                httpOnly: true
            }).json({ success: true, message: "login", 'user_role': userRole, "user_id": userId, "school_id": schoolId, 'token': token });
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    forgotPasswordPage: async function (req, res) {
        res.render("forgot-password", { page: "" });
    },
    ChangePassword: async function (req, res) {
        res.render("change-password", { page: "" });
    },
    forgotPassword: async function (req, res) {
        try {
            const email = req.body.email;
            const otp = Math.floor(100000 + Math.random() * 900000); // generate 6-digit OTP
            if (!email) {
                throw new Error("Enter your mail")
            }
            if (!validator.isEmail(email)) {
                throw new Error("Invalid email");
            }
            let user = await adminUsers.getUserByEmail(email);
            let userId = user.user_id;
            if (!user || user == "") {
                throw new Error("User not found");
            }
            adminUsers.updateOTPForAdminUser(email, otp).then(async response => {
                res.status(200).json({ 'success': true, 'message': "OTP sent to email successfully", 'user_id': userId })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
            // Send OTP to Email
            const mailOptions = {
                from: 'vamseedarling15@gmail.com',
                to: email,
                subject: 'OTP for Your Account',
                html: `
                <p>Your OTP for change password is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
              `
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.send(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send('OTP sent to email');
                }
            });
            setTimeout(() => {
                // code to expire OTP after 5 minutes
            }, 5 * 60 * 1000);
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    verifyOtp: async function (req, res) {
        try {
            const otp = req.body.otp;
            const userId = req.body.userId;
            if (!otp) {
                throw new Error("Enter OTP")
            }
            if (!userId) {
                throw new Error("Invalid request")
            }
            let otpVerification = await adminUsers.verifyOTPForAdminUser(otp, userId);
            if (otpVerification == "") {
                throw new Error("Invalid OTP")
            }
            if (otpVerification) {
                res.status(200).json({ 'success': true, 'message': "OTP verified successfully", 'userId': userId })
            }
            else {
                res.status(200).json({ success: false, message: "Invalid otp" })
            }
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    resetPasswordPage: async function (req, res) {
        res.render("reset-password", { page: "" });
    },
    resetPassword: async function (req, res) {
        try {
            const userId = req.body.userId;
            const newPassword = req.body.newPassword;
            const confirmPassword = req.body.confirmPassword;
            if (!userId) {
                throw new Error("Invalid request")
            }
            if (!newPassword) {
                throw new Error("Enter new password")
            }
            if (!confirmPassword) {
                throw new Error("Enter confirm password")
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).send('New password and confirm password do not match');
            }
            const hashpassword = bcrypt.hashSync(newPassword, saltRounds);
            await adminUsers.resetPasswordForAdminUser(userId, hashpassword).then(response => {
                res.status(200).json({ 'success': true, 'message': "Password updated successfully" })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },

    updateSchoolStatus: async function (req, res) {
        try {
            const schoolId = req.body.schoolId;
            const type = req.body.type;
            if (!schoolId) {
                throw new Error("Invalid school id")
            }
            if (!type) {
                throw new Error("Invalid status")
            }
         schools.updateStatusForSchool(schoolId, type).then(response => {
            if(type==2){
                let status = 1;
                adminUsers.updateStatusForAdminUser(schoolId, status).then(response => {
                    res.status(200).json({ 'success': true, 'message': "Admin accepted succesfully" })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            }else if(type==3){
                let status = 3;
                adminUsers.updateStatusForAdminUser(schoolId, status).then(response => {
                    res.status(200).json({ 'success': true, 'message': "Admin rejected succesfully" })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            }
                
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    deleteSchool: async function (req, res) {
        try {
            let schoolId = req.body.schoolId;
            if (!schoolId) {
                throw new Error("Invalid request");
            }
             schools.deleteSchool(schoolId).then(response => {
                adminUsers.deleteSchoolAdmin(schoolId).then(response => {
                    res.status(200).json({ 'success': true, 'message': "School deleted succesfully" })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            });
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    schoolDetails: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let schoolId = Buffer.from(req.params.id, 'base64').toString();
        schoolId = schoolId.split('=');
        schoolId = schoolId[1];
        if(decoded.role===3){
   
        }else{
            let aboutUsData = await aboutUs.getAboutUsRecords(schoolId);
            let facilityData = await facilities.getFacilityRecords(schoolId);
            let galleryData = await gallery.getGalleryRecordsById(schoolId);
            let feeStructureData = await feeStructure.getFeeStructureRecords(schoolId);
            let testimonialData = await testiminials.getTestimonialRecordsById(schoolId);
            res.render("admin/school-details", { aboutUsData: aboutUsData, facilityData: facilityData, galleryData: galleryData, feeStructureData: feeStructureData, testimonialData: testimonialData, page: "schools", token: decoded, title: "school details" });
        }
    },
    aboutUsPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect("/")  
        }else{
            let aboutUsList = await aboutUs.getAboutUsRecords(decoded.school_id);
            res.render("admin/about-us", { aboutUsList: aboutUsList, page: "about-us", token: decoded, title: "About us" });
        }
    },
    addAboutUs: async function (req, res) {
        try {
            // to get role of user
            let token = req.token;
            const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
            let schoolId = req.body.schoolId;
            let schoolName = req.body.schoolName;
            let image = req.body.image;
            let description = req.body.description;
            let date = getDateTime();
            if (!schoolId) {
                throw new Error("Invalid school id");
            }
            if (!schoolName) {
                throw new Error("Enter school name");
            }
            if (!description) {
                throw new Error("Enter description");
            }
            let ImagePath = "";
            if (image) {
                const uploadFolder = "static/uploads";
                const isValid = isValidFile(image);
                const fileName = encodeURIComponent(image.originalFilename.replace(/\s/g, "-"));
                if (!isValid) {
                    return res.status(400).json({
                        status: false,
                        message: "The file type is not a valid type",
                    });
                }
                fs.renameSync(image.filepath, path.join(uploadFolder, fileName));
                ImagePath = uploadFolder + "/" + fileName;
            }
            const schoolIdExists = await aboutUs.checkSchoolId(schoolId);
            let aboutUsUpdateData = {
                school_name: schoolName,
                description: description,
                created_at: date,
                updated_at: date
            };
            if (ImagePath) {
                aboutUsUpdateData['image'] = ImagePath;
            }
            if (schoolIdExists) {               
                aboutUs.updateAboutUs(aboutUsUpdateData, schoolId).then(response => {
                    res.status(200).json({ 'success': true, 'message': "About Us updated successfully", "user_role": decoded.role })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            } else {
                aboutUsUpdateData['school_id'] = schoolId;
                if (ImagePath) {
                    aboutUsUpdateData['image'] = ImagePath;
                }
                aboutUs.saveSchoolAboutUs(aboutUsUpdateData).then(response => {
                    res.status(200).json({ 'success': true, 'message': "About Us added successfully", "user_role": decoded.role })

                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            }
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    // facilities page
    facilitiesPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
    if(decoded.role===1 || decoded.role===2){
        res.redirect("/")
    }else{
        let facilityList = await facilities.getFacilityRecords(decoded.school_id);
        res.render("admin/facilities", { facilityList: facilityList, page: "facilities", token: decoded, title: "Facilities" });
    }   
    },
    facilityDetails: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let id = Buffer.from(req.params.id, 'base64').toString();
        id = id.split('=');
        id = id[1];
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            let facilityList = await facilities.getFacilityRecordsForListing(id);
            res.render("admin/facility-details", { facilityList: facilityList, page: "facilities", token: decoded, title: "facility details" });
        }
    },
    facilityDetailsForAdmin: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let id = Buffer.from(req.params.id, 'base64').toString();
        id = id.split('=');
        id = id[1];
        if(decoded.role===3){
            res.redirect('/')
        }else{
            let facilityData = await facilities.getFacilityRecordsForListing(id);
            res.render("admin/facility-details", { facilityList: facilityData, page: "schools", token: decoded, title: "facility details" });
        }
    },
    addFacilitiesPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            res.render("admin/add-facilities", { page: "facilities", token: decoded, title: "Facilities" });
        }
    },
    addFacilities: async function (req, res) {
        try {
            let schoolId = req.body.schoolId;
            let name = req.body.name;
            let description = req.body.description;
            let image = req.body.image;
            let location = req.body.location;
            let capacity = req.body.capacity;
            let date = getDateTime();
            if (!schoolId) {
                throw new Error("Invalid schoolId");
            }
            if (!name) {
                throw new Error("Enter facility name");
            }
            if (!description) {
                throw new Error("Enter description");
            }
            if (!location) {
                throw new Error("Enter location");
            }
            if (!capacity) {
                throw new Error("Enter capacity");
            }
            let ImagePath = "";
            if (image) {
                const uploadFolder = "static/uploads";
                const isValid = isValidFile(image);
                const fileName = encodeURIComponent(image.originalFilename.replace(/\s/g, "-"));
                if (!isValid) {
                    return res.status(400).json({
                        status: false,
                        message: "The file type is not a valid type",
                    });
                }
                fs.renameSync(image.filepath, path.join(uploadFolder, fileName));
                ImagePath = uploadFolder + "/" + fileName;
            }
            let facilitiesData = {
                school_id: schoolId,
                name: name,
                description: description,
                location: location,
                capacity: capacity,
                created_at: date,
                updated_at: date
            };
            if (ImagePath) {
                facilitiesData['image'] = ImagePath;
            }
            facilities.saveSchoolFacilities(facilitiesData).then(response => {
                res.status(200).json({ 'success': true, 'message': "Facility updated successfully" })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    // edit facilities
    editFacilitiesPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let facilityId = Buffer.from(req.params.id, 'base64').toString();
        facilityId = facilityId.split('=');
        facilityId = facilityId[1];
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            let facilityList = await facilities.getFacilityById(facilityId);
            res.render("admin/edit-facilities", { facilityList: facilityList, page: "facilities", token: decoded, title: "Facilities" });
        }
    },
    editFacilitiesPageForAdmin: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let facilityId = Buffer.from(req.params.id, 'base64').toString();
        facilityId = facilityId.split('=');
        facilityId = facilityId[1];
        if(decoded.role===3){
            res.redirect('/')
        }else{
            let facilityList = await facilities.getFacilityById(facilityId);
            res.render("admin/edit-facilities", { facilityList: facilityList, page: "schools", token: decoded, title: "Facilities" });
        }
    },
    editFacilities: async function (req, res) {
        try {
            let token = req.token;
            const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
            let facilityId = req.body.facilityId;
            let name = req.body.name;
            let description = req.body.description;
            let image = req.body.image;
            let location = req.body.location;
            let capacity = req.body.capacity;
            let date = getDateTime();
            if (!facilityId) {
                throw new Error("Invalid schoolId");
            }
            if (!name) {
                throw new Error("Enter facility name");
            }
            if (!description) {
                throw new Error("Enter description");
            }
            if (!location) {
                throw new Error("Enter location");
            }
            if (!capacity) {
                throw new Error("Enter capacity");
            }
            let ImagePath = "";
            if (image) {
                const uploadFolder = "static/uploads";
                const isValid = isValidFile(image);
                const fileName = encodeURIComponent(image.originalFilename.replace(/\s/g, "-"));
                if (!isValid) {
                    return res.status(400).json({
                        status: false,
                        message: "The file type is not a valid type",
                    });
                }
                fs.renameSync(image.filepath, path.join(uploadFolder, fileName));
                ImagePath = uploadFolder + "/" + fileName;
            }
            let facilitiesData = {
                name: name,
                description: description,
                location: location,
                capacity: capacity,
                created_at: date,
                updated_at: date
            };
            if (ImagePath) {
                facilitiesData['image'] = ImagePath;
            }
            facilities.updateFecilities(facilitiesData, facilityId).then(response => {
                res.status(200).json({ 'success': true, 'message': "Facility updated successfully", 'user_role': decoded.role })

            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    //  delete facilities
    deleteFacility: async function (req, res) {
        try {
            let FacilityId = req.body.FacilityId;
            if (!FacilityId) {
                throw new Error("Invalid request");
            }
            facilities.deleteFacility(FacilityId).then(response => {
                res.status(200).json({ 'success': true, 'message': "Facility deleted successfully" })
            }).catch(error => {
                res.json(error)
            });
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    // fee structure
    feeStructurePage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            let feeStructureList = await feeStructure.getFeeStructureRecords(decoded.school_id);
            res.render("admin/fee-structure", { feeStructureList: feeStructureList, page: "fee-structure", token: decoded, title: "Fee structure" });
        }
    },
    addFeeStructure: async function (req, res) {
        try {
            //get role
            let token = req.token;
            const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
            let schoolId = req.body.schoolId;
            let title = req.body.title;
            let fees = req.body.fees;
            let date = getDateTime();
            if (!schoolId) {
                throw new Error("Invalid school id");
            }
            if (!title) {
                throw new Error("Enter title");
            }
            if (!fees) {
                throw new Error("Enter fees");
            }
            const schoolIdExists = await feeStructure.checkSchoolId(schoolId);
            let feeStructureUpdateData = {
                title: title,
                fees: fees,
                created_at: date,
                updated_at: date
            };
            if (schoolIdExists) {
                feeStructure.updateFeeStructure(feeStructureUpdateData, schoolId).then(response => {
                    res.status(200).json({ 'success': true, 'message': "Fee structure updated successfully", "user_role": decoded.role })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            } else {
                feeStructureUpdateData['school_id'] = schoolId;
                feeStructure.saveSchoolFeeStructure(feeStructureUpdateData).then(response => {
                    res.status(200).json({ 'success': true, 'message': "Fee structure added successfully", "user_role": decoded.role })
                }).catch(error => {
                    res.status(200).json({ success: false, message: error.message })
                })
            }
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    // gallary
    galleryPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            let galleryList = await gallery.getGalleryRecordsById(decoded.school_id);
            res.render("admin/gallery", { galleryList: galleryList, page: "gallery", token: decoded, title: "Gallery" });
        }
    },
    addGalleryPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            res.render("admin/add-gallery", { page: "gallery", token: decoded, title: "Gallery" });
        }
    },
    addGallery: async function (req, res) {
        try {
            let schoolId = req.body.schoolId;
            let image = req.body.image;
            let date = getDateTime();
            if (!schoolId) {
                throw new Error("Invalid schoolId");
            }
            let ImagePath = "";
            if (image) {
                const uploadFolder = "static/uploads";
                const isValid = isValidFile(image);
                const fileName = encodeURIComponent(image.originalFilename.replace(/\s/g, "-"));
                if (!isValid) {
                    return res.status(400).json({
                        status: false,
                        message: "The file type is not a valid type",
                    });
                }
                fs.renameSync(image.filepath, path.join(uploadFolder, fileName));
                ImagePath = uploadFolder + "/" + fileName;
            }
            let galleryData = {
                school_id: schoolId,
                created_at: date,
                updated_at: date
            };
            if (ImagePath) {
                galleryData['image'] = ImagePath;
            }
            await gallery.saveSchoolGallery(galleryData).then(response => {
                res.status(200).json({ 'success': true, 'message': "Gallery added successfully" })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    deleteGalleryImage: async function (req, res) {
        try {
            // to get role of user
            let token = req.token;
            const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
            let galleryId = req.body.galleryId;
            if (!galleryId) {
                throw new Error("Invalid request");
            }
            gallery.deleteGalleryImage(galleryId).then(response => {
                res.status(200).json({ 'success': true, 'message': "Gallery image deleted successfully", 'user_role': decoded.role })
            }).catch(error => {
                res.json(error)
            });
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    // testimonials
    testimonialsPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            let testimonilasList = await testiminials.getTestimonialRecordsById(decoded.school_id);
            res.render("admin/testimonials", { testimonilasList: testimonilasList, page: "testimonials", token: decoded, title: "Testimonials" });
        }
    },
    addTestimonilasPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            res.render("admin/add-testimonials", { page: "testimonials", token: decoded, title: "Testimonials" });
        }
    },
    addTestimonials: async function (req, res) {
        try {
            let schoolId = req.body.schoolId;
            let name = req.body.name;
            let profile = req.body.profile;
            let designation = req.body.designation;
            let description = req.body.description;
         
            let date = getDateTime();
            if (!schoolId) {
                throw new Error("Invalid schoolId");
            }
            if (!name) {
                throw new Error("Enter  name");
            }
            if (!designation) {
                throw new Error("Enter designation");
            }
            if (!description) {
                throw new Error("Enter description");
            }
            let profilePath = "";
            if (profile) {
                
                const uploadFolder = "static/uploads";
                const isValid = isValidFile(profile);
                const fileName = encodeURIComponent(profile.originalFilename.replace(/\s/g, "-"));
                if (!isValid) {
                    return res.status(400).json({
                        status: false,
                        message: "The file type is not a valid type",
                    });
                }
                fs.renameSync(profile.filepath, path.join(uploadFolder, fileName));
                profilePath = uploadFolder + "/" + fileName;
            }
            let testimonialsData = {
                school_id: schoolId,
                name: name,
                designation: designation,
                description: description,
                created_at: date,
                updated_at: date
            };
            if (profilePath) {
                testimonialsData['profile'] = profilePath;
            }
            testiminials.saveSchoolTestimonials(testimonialsData).then(response => {
                res.status(200).json({ 'success': true, 'message': "Testimonials added successfully" })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    //edit testimonials page
    editTestimonilasPage: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let testimonialId = Buffer.from(req.params.id, 'base64').toString();
        testimonialId = testimonialId.split('=');
        testimonialId = testimonialId[1];
        if(decoded.role===1 || decoded.role===2){
            res.redirect('/')
        }else{
            let testimonialsList = await testiminials.getTestimonialsById(testimonialId);
            res.render("admin/edit-testimonials", { testimonialsList: testimonialsList, page: "testimonials", token: decoded, title: "Testimonials" });
        }
    },
    editTestimonilasPageForAdmin: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let testimonialId = Buffer.from(req.params.id, 'base64').toString();
        testimonialId = testimonialId.split('=');
        testimonialId = testimonialId[1];
        if(decoded.role===3){
            res.redirect('/')
        }else{
  let testimonialsList = await testiminials.getTestimonialsById(testimonialId);
        res.render("admin/edit-testimonials", { testimonialsList: testimonialsList, page: "schools", token: decoded, title: "Testimonials" });
        }
    },
    editTestimonials: async function (req, res) {
        try {
            //to get user role
            let token = req.token;
            const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
            let testimonialId = req.body.testimonialId;
            let name = req.body.name;
            let profile = req.body.profile;
            let designation = req.body.designation;
            let description = req.body.description;
            let date = getDateTime();
            if (!testimonialId) {
                throw new Error("Invalid schoolId");
            }
            if (!name) {
                throw new Error("Enter name");
            }
            if (!designation) {
                throw new Error("Enter facility name");
            }
            if (!description) {
                throw new Error("Enter description");
            }

            let profilePath = "";
            if (profile) {
         
                const uploadFolder = "static/uploads";
                const isValid = isValidFile(profile);
                const fileName = encodeURIComponent(profile.originalFilename.replace(/\s/g, "-"));
                if (!isValid) {
                    return res.status(400).json({
                        status: false,
                        message: "The file type is not a valid type",
                    });
                }
                fs.renameSync(profile.filepath, path.join(uploadFolder, fileName));
                profilePath = uploadFolder + "/" + fileName;
            }
            let testimonialsData = {
                name: name,
                designation: designation,
                description: description,
                created_at: date,
                updated_at: date
            };
            if (profilePath) {
                testimonialsData['profile'] = profilePath;
            }
            testiminials.updateTestimonials(testimonialsData, testimonialId).then(response => {
                res.status(200).json({ 'success': true, 'message': "Testimonial updated successfully", 'user_role': decoded.role })

            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    testimonilasDetails: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let testimonialId = Buffer.from(req.params.id, 'base64').toString();
        testimonialId = testimonialId.split('=');
        testimonialId = testimonialId[1];
        if(decoded.role===1 || decoded.role===2){
            res.redirect("/")
        }else{
            let testimonialsList = await testiminials.getTestimonialsById(testimonialId);
            res.render("admin/testimonials-details", { testimonialsList: testimonialsList, page: "testimonials", token: decoded, title: "Testimonials details" });
        }
    },
    testimonilasDetailsForAdmin: async function (req, res) {
        let token = req.token;
        const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
        let testimonialId = Buffer.from(req.params.id, 'base64').toString();
        testimonialId = testimonialId.split('=');
        testimonialId = testimonialId[1];
        if(decoded.role===3){
            res.redirect('/')
        }else{
            let testimonialsList = await testiminials.getTestimonialsById(testimonialId);
            res.render("admin/testimonials-details", { testimonialsList: testimonialsList, page: "schools", token: decoded, title: "Testimonials details" });
        }
    },
    deleteTestimonial: async function (req, res) {
        try {
            // to get role of user
            let token = req.token;
            const decoded = jwt.decode(token, '109156be-c4fb-41ea-b1b4-efe1671c5836');
            let testimonialId = req.body.testimonialId;
            if (!testimonialId) {
                throw new Error("Invalid request");
            }
            testiminials.deleteTestimonial(testimonialId).then(response => {
                res.status(200).json({ 'success': true, 'message': "Testimonial deleted successfully", "user_role": decoded.role })
            }).catch(error => {
                res.json(error)
            });
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    // logout
    AdminLogout: async function (req, res) {
        try {
            let token = req.token;
            res.status(200).cookie('access_token', 'Bearer ' + token, {
                expires: new Date(Date.now())
            }).redirect('/');
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
}

const isValidFile = (file) => {
 
    const type = file.originalFilename.split(".").pop();
    const validTypes = ["png", "jpg", "jpeg"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};