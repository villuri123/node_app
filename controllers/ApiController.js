const bcrypt = require('bcrypt');
const saltRounds = 10;
const validator = require('validator');
const schools = require('../models/schools');
const adminUsers = require('../models/adminUsers');
const aboutUs = require('../models/aboutUs');
const feeStructure = require('../models/feeStructure');
const facilities = require('../models/facilities');
const gallery = require('../models/gallery');
const testimonials = require('../models/testimonials');
const { getJWTToken } = require('../utils/jwt');
const jwt = require("jsonwebtoken");
const { getDateTime } = require('../utils/dateTime');
const path = require('path');
const fs = require('fs');
// to convert data into plain text
// const cheerio=require('cheerio');
const mobileRegex = /^[6789]\d{9}$/;
var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports = {
    // schools
    signUp: async function (req, res) {
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
                throw new Error("Enter principleName");
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
                    res.status(200).json({ success: true, message: "school registred successfully" })
                })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    login: async function (req, res) {
        try {
            let user_name = req.body.user_name;
            let password = req.body.password;
            if (!validator.isEmail(user_name)) {
                throw new Error("Invalid user name");
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
            const isvalid = bcrypt.compareSync(password, user.password);
            if (!isvalid) {
                throw new Error(" Password incorrect");
            }
            const token = await getJWTToken(user);
            console.log(token);
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
    aboutUs: async function (req, res) {
        try {
            let token = req.body.token;
            let userId = req.body.user_id;
            let schoolId = req.body.school_id;
            if (!token) {
                throw new Error("Enter token");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let tokenVerification = await adminUsers.verifyTokenForAdminUser(schoolId,token,userId);
            if (!tokenVerification) {
                throw new Error("Invalid Token")
            }
            await aboutUs.getAboutUsData(schoolId).then(response => {
                res.status(200).json({ success: true, 'data': response })
            });
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    feeStructure: async function (req, res) {
        try {
            let token = req.body.token;
            let userId = req.body.user_id;
            let schoolId = req.body.school_id;
            if (!token) {
                throw new Error("Enter token");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let tokenVerification = await adminUsers.verifyTokenForAdminUser(schoolId,token,userId);
            if (!tokenVerification) {
                throw new Error("Invalid Token")
            }
            await feeStructure.getFeeStructureData(schoolId).then(response => {
                res.status(200).json({ success: true, 'data': response })
            });
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    facilities: async function (req, res) {
        try {
            let token = req.body.token;
            let userId = req.body.user_id;
            let schoolId = req.body.school_id;
            if (!token) {
                throw new Error("Enter token");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let tokenVerification = await adminUsers.verifyTokenForAdminUser(schoolId,token,userId);
            if (!tokenVerification) {
                throw new Error("Invalid Token")
            }
            await facilities.getFacilityRecordsData(schoolId).then(response => {
                res.status(200).json({ success: true, 'data': response });
            });
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    gallery: async function (req, res) {
        try {
            let token = req.body.token;
            let userId = req.body.user_id;
            let schoolId = req.body.school_id;
            if (!token) {
                throw new Error("Enter token");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let tokenVerification = await adminUsers.verifyTokenForAdminUser(schoolId,token,userId);
            if (!tokenVerification) {
                throw new Error("Invalid Token")
            }
            await gallery.getGalleryRecordsData(schoolId).then(response => {
                res.status(200).json({ success: true, "data": response });
            });
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    testimonials: async function (req, res) {
        try {
            let token = req.body.token;
            let userId = req.body.user_id;
            let schoolId = req.body.school_id;
            if (!token) {
                throw new Error("Enter token");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let tokenVerification = await adminUsers.verifyTokenForAdminUser(schoolId,token,userId);
            if (!tokenVerification) {
                throw new Error("Invalid Token")
            }
            await testimonials.getTestimonialData(schoolId).then(response => {
                // if u want data into text format
                // response.forEach((row) => {
                //     const $ = cheerio.load(row.description);
                //     row.description = $.text();
                //   });
                res.status(200).json({ success: true, "data": response });
            });
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    addGallery: async function (req, res) {
        try {
            let token = req.body.token;
            let userId = req.body.user_id;
            let schoolId = req.body.school_id;
            let image = req.body.image;
            if (!token) {
                throw new Error("Enter token");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let tokenVerification = await adminUsers.verifyTokenForAdminUser(schoolId,token,userId);
            if (!tokenVerification) {
                throw new Error("Invalid Token")
            }
            // console.log(image);return;
            let date = getDateTime();
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
                res.status(200).json({ 'success': true, 'message': "Gallery added successfully","data": response })
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    schools: async function (req, res) {
        try {
            schools.getSchoolRecords().then(response => {
                res.json(response)
            }).catch(error => {
                res.json(error)
            });
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }

    },
    getSchoolById: async function (req, res) {
        try {
            let schoolId = req.body.schoolId;
            if (!schoolId) {
                throw new Error("Invalid request");
            }
            let user = await schools.checkSchoolIdExists(schoolId);
            if(!user){
                res.json({success:false,message:"School not found"});
            }
            schools.getSchoolById(schoolId).then(response => {
                res.json(response)
            }).catch(error => {
                res.json(error)
            });
        }
        catch (error) {
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