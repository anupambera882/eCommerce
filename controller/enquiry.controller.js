const EnquiryService = require("../service/enquiry.service");
const validateMongodbId = require("../utils/validateMongodbId.utils");
class EnquiryController {
    static createEnquiry = async (req, res) => {
        try {
            const { name } = req.body;
            const newEnquiry = EnquiryService.createNewEnquiry({ name: name });

            return res.status(201).json({
                success: true,
                message: 'New Enquiry  created successfully',
                Enquiry: newEnquiry
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to created new Enquiry ",
                errMessage: err.message
            });
        }
    }

    static updateEnquiry = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const update = await EnquiryService.updateEnquiryDetailsById(id, req.body);

            return res.status(201).json({
                success: true,
                message: 'successfully update Enquiry',
                data: update
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to update Enquiry",
                errMessage: err.message
            });
        }
    }

    static deleteEnquiry = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            await EnquiryService.updateEnquiryDetailsById(id, { isDeleted: true });

            return res.status(201).json({
                success: true,
                message: 'successfully delete Enquiry'
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "unable to delete Enquiry",
                errMessage: err.message
            });
        }
    }

    static getEnquiryById = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const Enquiry = await EnquiryService.getEnquiryByPK({ _id: id });

            return res.status(201).json({
                success: true,
                data: Enquiry
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "can not get data",
                errMessage: err.message
            });
        }
    }

    static getAllEnquiry = async (req, res) => {
        try {
            const { id } = req.params;
            validateMongodbId(id, res);
            const all = await EnquiryService.getAllEnquiry();

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

module.exports = EnquiryController;