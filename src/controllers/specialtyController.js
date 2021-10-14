import specialtyServices from "../services/specialtyServices";

let createSpecialty = async (req, res) => {
    try {
        let specialty = await specialtyServices.createSpecialty(req.body)
        return res.status(200).json(specialty)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let info = await specialtyServices.getAllSpecialty()
        return res.status(200).json(info)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}

module.exports = {
    createSpecialty,
    getAllSpecialty,
}