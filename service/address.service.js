const AddressModel = require("../models/address.model");

class AddressService {
    static createNewAddress = async (newAddressDetails) => {
        const newAddress = new AddressModel(newAddressDetails);
        const newAddressSave = await newAddress.save();
        return newAddressSave;
    }

    static getAddressByPK = async (pk, select = 0) => {
        if (select) {
            const addressData = await AddressModel.findOne(pk, select);
            return addressData;
        }
        const addressData = await AddressModel.findOne(pk);
        return addressData;
    }

    static getAUserAllAddressByUserId = async (userId) => {
        const userAllAddress = await AddressModel.find({ userId: userId });
        return userAllAddress;
    }

    static updateAddressDetailsById = async (id, updateData) => {
        const updateAddressData = await AddressModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateAddressData;
    }
}


module.exports = AddressService;