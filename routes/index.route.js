const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const blogRoute = require('./blog.route');
const productCategoryRoute = require('./productCategory.route');
const blogCategoryRoute = require('./blogCategory.route');
const brandRoute = require('./brand.route');
const couponRoute = require('./coupon.route');
const enquiryRoute = require('./enquiry.route');
const addressRoute = require('./address.route');
const colorRoute = require('./color.route');

module.exports = (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());


    // All route
    app.use("/api/user", userRoute);
    app.use('/api/product', productRoute);
    app.use('/api/address', addressRoute);
    app.use('/api/blog', blogRoute);
    app.use('/api/productCategory', productCategoryRoute);
    app.use('/api/blogCategory', blogCategoryRoute);
    app.use('/api/brand', brandRoute);
    app.use('/api/coupon', couponRoute);
    app.use('/api/enquiry', enquiryRoute);
    app.use('/api/color', colorRoute);


    // manage if any unknown request is coming or a bad request coming
    app.use('*', async (req, res) => {
        return res.status(404).json({
            success: false,
            errorMessage: "This route is not exist"
        })
    })
}