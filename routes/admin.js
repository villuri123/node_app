let express = require('express');
const Admin = require('../controllers/AdminController');
const { basicRequestAuth } = require('../utils/auth');
let router = express.Router();

//home page
router.get("/schools", basicRequestAuth, Admin.schoolsList);
// Add schools
router.post("/school-registration", Admin.addSchool);
// Admin approval to change status
router.post("/school-status", basicRequestAuth, Admin.updateSchoolStatus);
// delete the school
router.post("/delete-school", basicRequestAuth, Admin.deleteSchool);
// get the school details
router.get("/school-details/:id", basicRequestAuth, Admin.schoolDetails);
//get about us page
router.get('/about-us', basicRequestAuth, Admin.aboutUsPage);
router.post("/add-about-us", basicRequestAuth, Admin.addAboutUs);
//facilities
router.get('/facilities', basicRequestAuth, Admin.facilitiesPage);
router.get('/add-facilities', basicRequestAuth, Admin.addFacilitiesPage);
router.post("/add-facilities", basicRequestAuth, Admin.addFacilities);
//edit facilities
router.get('/edit-facilities/:id', basicRequestAuth, Admin.editFacilitiesPage);
// edit facilities for admin
router.get('/edit-facilities-for-admin/:id', basicRequestAuth, Admin.editFacilitiesPageForAdmin);
router.post('/edit-facilities', basicRequestAuth, Admin.editFacilities);
//delete the facilities
router.post("/delete-facilities", basicRequestAuth, Admin.deleteFacility);
// facility single page
router.get("/facility-details/:id", basicRequestAuth, Admin.facilityDetails);
// admin can see facility single page
router.get("/facility-details-for-admin/:id", basicRequestAuth, Admin.facilityDetailsForAdmin);
//fee structure
router.get('/fee-structure', basicRequestAuth, Admin.feeStructurePage);
router.post("/add-fee-structure", basicRequestAuth, Admin.addFeeStructure);
//gallery 
router.get('/gallery', basicRequestAuth, Admin.galleryPage);
router.get('/add-gallery', basicRequestAuth, Admin.addGalleryPage);
router.post("/add-gallery", basicRequestAuth, Admin.addGallery);
router.post("/delete-image", basicRequestAuth, Admin.deleteGalleryImage);
//testiminials
router.get('/testimonials', basicRequestAuth, Admin.testimonialsPage);
router.get('/add-testimonials', basicRequestAuth, Admin.addTestimonilasPage);
router.post("/add-testimonials", basicRequestAuth, Admin.addTestimonials);
// edit testimonials
router.get('/edit-testimonials/:id', basicRequestAuth, Admin.editTestimonilasPage);
router.get('/edit-testimonials-for-admin/:id', basicRequestAuth, Admin.editTestimonilasPageForAdmin);
router.post('/edit-testimonials', basicRequestAuth, Admin.editTestimonials);
// testimonilas single page
router.get("/testimonials-details/:id", basicRequestAuth, Admin.testimonilasDetails);
// admin can see testimonials single page
router.get("/testimonials-details-for-admin/:id", basicRequestAuth, Admin.testimonilasDetailsForAdmin);
// delete the testimonials
router.post("/delete-testimonials", basicRequestAuth, Admin.deleteTestimonial);
// admin logout
router.get('/logout', basicRequestAuth, Admin.AdminLogout);

module.exports = router;