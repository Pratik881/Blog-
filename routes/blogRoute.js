
const { multer, storage } = require('../middleware/multerConfig'); // Update the path accordingly

const { renderAddBlog, addBlog, showAll, renderSingleBlog, deleteBlog, editForm, editBlog, userLogin } = require('../controllers/userLogin');
const { registerPage, userRegistration, userLoginPage } = require('../controllers/authController');
const router = require('express').Router();

const upload = multer({ storage: storage });
router.route('/').get(showAll)
router.route('/blogs/:blogId').get(renderSingleBlog)
router.route('/delete/:blogId').get(deleteBlog)
//edit garni form dekhauna
router.route('/edit/:blogId').get(editForm).post(upload.single('image'),editBlog)
router.route('/addBlog').get(renderAddBlog).post(upload.single('image'), addBlog);
router.route('/register').get(registerPage).post(userRegistration)
//user registration
//router.route('/register').post(userRegistration)
//user Login form
router.route('/login').get(userLoginPage)
//user login post request
router.route('/login').post(userLogin);
module.exports = router;
