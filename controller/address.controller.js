const AddressService = require('../service/address.service');
const UserService = require('../service/user.service');
const validateMongodbId = require('../utils/validateMongodbId.utils');
class AddressController {
    static createAddress = async (req, res) => {
        try {
            const { name, mobile, pinCode, address } = req.body;
            const { userId } = req.user;
            const newAddress = await AddressService.createNewAddress({
                name: name,
                mobile: mobile,
                pinCode: pinCode,
                address: address,
                userId: userId
            });
            await UserService.updateUserDetailsById(userId, { $push: { address: newAddress._id } })
            return res.status(201).json({
                success: true,
                message: 'New Address  created successfully',
                Address: newAddress
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to created new Address ",
                errMessage: err.message
            });
        }
    }

    static updateAddress = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const update = await AddressService.updateAddressDetailsById(id, req.body);

            return res.status(201).json({
                success: true,
                message: 'successfully update Address',
                data: update
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update Address",
                errMessage: err.message
            });
        }
    }

    static deleteAddress = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            await AddressService.updateAddressDetailsById(id, { isDeleted: true });

            return res.status(201).json({
                success: true,
                message: 'successfully delete Address'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete Address",
                errMessage: err.message
            });
        }
    }

    static getAddressById = async (req, res) => {
        try {
            const { id } = req.params;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const Address = await AddressService.getAddressByPK({ _id: id });

            return res.status(201).json({
                success: true,
                data: Address
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }

    static getAllAddressOfAUser = async (req, res) => {
        try {
            const { userId } = req.users;
            const valid = validateMongodbId(id);
            if (!valid) {
                return res.status(400).json({
                    "success": false,
                    "message": "This id is not valid or not found"
                })
            }
            const all = await AddressService.getAUserAllAddressByUserId(userId);

            return res.status(201).json({
                success: true,
                data: all
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }
}

module.exports = AddressController;