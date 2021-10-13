import patientServices from "../services/patientServices";

let postBookAppointment = async (req, res) => {
    try {
        let patients = await patientServices.postBookAppointment(req.body);
        return res.status(200).json(patients)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error form server...'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let patients = await patientServices.postVerifyBookAppointment(req.body);
        return res.status(200).json(patients)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error form server...'
        })
    }
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}