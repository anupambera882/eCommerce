const { default: mongoose } = require("mongoose")

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB is connected successfully");
    } catch (err) {
        console.log(err.message);
    }
}