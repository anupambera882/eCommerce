const { UserModel } = require("../models/user.model");

class UserService {
    static createNewUser = async (newUserDetails) => {
        const newUser = new UserModel(newUserDetails);
        const newUserSave = await newUser.save();
        return newUserSave;
    }

    static getUserByPK = async (pk, select = 0) => {
        if (select) {
            const userData = await UserModel.findOne(pk, select);
            return userData;
        }
        const userData = await UserModel.findOne(pk);
        return userData;
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