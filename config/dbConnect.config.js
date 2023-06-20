const { default: mongoose } = require("mongoose")

module.exports = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URI, {

        });
        console.log("DB is connected successfully");
    } catch (err) {
        console.log(err.message);
    }
}
