const BrandModel = require('../models/brand.model');

class BrandService {
    static createNewBrand = async (newBrandDetails) => {
        const newBrand = new BrandModel(newBrandDetails);
        const newBrandSave = await newBrand.save();
        return newBrandSave;
    }

    static getBrandByPK = async (pk, select = 0) => {
        if (select) {
            const brandData = await BrandModel.findOne(pk, select);
            return brandData;
        }
        const brandData = await BrandModel.findOne(pk);
        return brandData;
    }

    static getAllBrand = async (filter, skip, limit, select = 0) => {
        if (filter) {
            const brandsData = await BrandModel.find(filter, select).skip(skip).limit(limit);
            return brandsData;
        }
        const brandsData = await BrandModel.find().skip(skip).limit(limit);
        return brandsData;
    }

    static updateBrandDetailsById = async (id, updateData) => {
        const updateBrandData = await BrandModel.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true
        });
        return updateBrandData;
    }
}

module.exports = BrandService;