const { UserModel } = require("../models/user.model");

class UserService {
    static createNewUser = async (newUserDetails) => {
        const newUser = new UserModel(newUserDetails);
        const newUserSave = await newUser.save();
        return newUserSave;
    }

    static getUserByPK = async (pk,populated = 0) => {
        if (populated) {
            const userData = await UserModel.findOne(pk).populate('wishList');
            return userData;
        }
        const userData = await UserModel.findOne(pk);
        return userData;
    }

    static getAllUser = async (select = 0) => {
        if (select) {
            const AllUser = await UserModel.find(select);
            return AllUser;
        }
        const AllUser = await UserModel.find();
        return AllUser;
    }

    static updateUserDetailsById = async (id, updateData) => {
        const updateUserData = await UserModel.findByIdAndUpdate(id, updateData,
            {
                new: true
            });
        return updateUserData;
    }
}

module.exports = UserService;