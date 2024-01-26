
const { multer, storage } = require('../middleware/multerConfig'); // Update the path accordingly

const { renderAddBlog, addBlog, showAll, renderSingleBlog, deleteBlog, editForm, editBlog, userLogin, logOut } = require('../controllers/userLogin');
const { registerPage, userRegistration, userLoginPage, showMyBlogs } = require('../controllers/authController');
const authenticateFunction = require('../middleware/isAuthenticated');
const welcomePageAuthentication = require('../middleware/welcomePageAuthentication');
const router = require('express').Router();

const upload = multer({ storage: storage });
router.route('/').get(welcomePageAuthentication,showAll)
router.route('/myBlogs').get(authenticateFunction,showMyBlogs)
router.route('/blogs/:blogId').get(renderSingleBlog)
router.route('/delete/:blogId').get(authenticateFunction,deleteBlog)
//edit garni form dekhauna
router.route('/edit/:blogId').get(authenticateFunction,editForm).post(upload.single('image'),editBlog)
router.route('/addBlog').get(authenticateFunction,renderAddBlog).post(upload.single('image'),authenticateFunction, addBlog);
router.route('/register').get(registerPage).post(userRegistration)
//user registration
//router.route('/register').post(userRegistration)
//user Login form
router.route('/login').get(userLoginPage)
//user login post request
router.route('/login').post(userLogin);
router.route('/logout').get(logOut)
module.exports = router;
