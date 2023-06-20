const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { modelName } = require('./AllModelName');

// role management in enum
const role = {
    ADMIN: 'admin',
    USER: 'user',
    // SELLER: 'seller'
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
        trim: true,
        uppercase: true
    },
    lastName: {
        type: String,
        required: true,
        index: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [10, "phone number must be 10 digit , don't use any space in between digit"],
        maxlength: 10
    },
    password: {
        type: String,
        required: true,
        // add some additional validation in final stage for strong password 
    },
    role: {
        type: String,
        enum: { values: [role.ADMIN, role.USER], message: '{VALUE} is not supported' },
        required: true,
        default: role.USER,
        trim: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    // for soft delete
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: modelName.ADDRESS }],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: modelName.PRODUCT }],
    refreshToken: {
        type: [String],
        default: [],
        required: true,
    }
}, {
    timestamps: true
});


// Soft delete is implemented
userSchema.pre('findOne', function (next) {
    if (this._conditions.isDeleted === true) {
        return next();
    }
    this.where({ isDeleted: false });
    next();
});

userSchema.pre('findByIdAndUpdate', function (next) {
    if (this._conditions.isDeleted === true) {
        return next();
    }
    this.where({ isDeleted: false });
    next();
});

// Password hashed in data base
// This is working save method
userSchema.pre("save", async function (next) {
    const salt = bcrypt.genSaltSync(Number.parseInt(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// This is working with findOneAndUpdate function if password is exist
userSchema.pre("findOneAndUpdate", async function (next) {
    if (this._update.$set && this._update.$set.password) {
        const salt = bcrypt.genSaltSync(Number.parseInt(process.env.SALT_ROUNDS));
        this._update.$set.password = await bcrypt.hash(this._update.$set.password, salt);
    }
    next();
});

// check password match
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


// Create model
const UserModel = mongoose.model(modelName.USER, userSchema);

module.exports = { UserModel, role }