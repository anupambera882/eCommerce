const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const blogRoute = require('./blog.route');
const categoryRoute = require('./category.route');
const multerMiddleware = require('../middleware/multer.middleware');

module.exports = (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Multer error handling middleware
    app.use('/api/product', multerMiddleware);


    // Route For testing
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    // All route
    app.use("/api/user", authRoute);
    app.use('/api/product', productRoute);
    app.use('/api/blog', blogRoute);
    app.use('/api/category', categoryRoute);

    // manage if any unknown request is coming or a bad request coming
    app.use('*', async (req, res) => {
        return res.status(404).json({
            success: false,
            errorMessage: "This route is not exist"
        })
    })
}