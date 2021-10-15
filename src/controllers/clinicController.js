import clinicServices from '../services/clinicServices';

let createClinic = async (req, res) => {
    try {
        let response = await clinicServices.createClinic(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ...'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let response = await clinicServices.getAllClinic();
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ...'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let response = await clinicServices.getDetailClinicById(req.query.id);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server ...'
        })
    }
}

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById
}