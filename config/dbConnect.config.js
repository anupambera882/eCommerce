const { default: mongoose } = require("mongoose")

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB is connected successfully");
    } catch (err) {
        console.log(err.message);
    }
}