const EnquiryModel = require("../models/enquiry.model");

class EnquiryService {
    static createNewEnquiry = async (newEnquiryDetails) => {
        const newEnquiry = new EnquiryModel(newEnquiryDetails);
        const newEnquirySave = await newEnquiry.save();
        return newEnquirySave;
    }

    static getEnquiryByPK = async (pk, select = 0) => {
        if (select) {
            const enquiryData = await EnquiryModel.findOne(pk, select);
            return enquiryData;
        }
        const enquiryData = await EnquiryModel.findOne(pk);
        return enquiryData;
    }

    static getAllEnquiry = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const enquiresData = await EnquiryModel.find(filter, select).skip(skip).limit(limit);
            return enquiresData;
        }
        const enquiresData = await EnquiryModel.find().skip(skip).limit(limit);
        return enquiresData;
    }

    static updateEnquiryDetailsById = async (id, updateData) => {
        const updateEnquiryData = await EnquiryModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateEnquiryData;
    }
}


module.exports = EnquiryService;