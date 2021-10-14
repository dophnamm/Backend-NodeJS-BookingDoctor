import db from "../models/index";
import _ from "lodash"
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ['password'] },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: { exclude: ['password', 'image'] },
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequireFields = (inputdata) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic',
        'addressClinic', 'note', 'specialtyId'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arr.length; i++) {
        if (!inputdata[arr[i]]) {
            isValid = false
            element = arr[i]
            break;
        }
    }
    return { isValid, element }
}

let saveDetailInfoDoctor = (inputdata) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequireFields(inputdata)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter : ${checkObj.element}`
                })
            } else {
                if (inputdata.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputdata.contentHTML,
                        contentMarkdown: inputdata.contentMarkdown,
                        description: inputdata.description,
                        doctorId: inputdata.doctorId
                    })
                } else if (inputdata.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputdata.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputdata.contentHTML;
                        doctorMarkdown.contentMarkdown = inputdata.contentMarkdown;
                        doctorMarkdown.description = inputdata.description;
                        await doctorMarkdown.save();
                    }
                }

                // up sert info doctor table
                let doctorInfo = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputdata.doctorId },
                    raw: false
                })
                if (doctorInfo) {
                    // update
                    doctorInfo.doctorId = inputdata.doctorId;
                    doctorInfo.priceId = inputdata.selectedPrice;
                    doctorInfo.provinceId = inputdata.selectedProvince;
                    doctorInfo.paymentId = inputdata.selectedPayment;
                    doctorInfo.nameClinic = inputdata.nameClinic;
                    doctorInfo.addressClinic = inputdata.addressClinic;
                    doctorInfo.note = inputdata.note;
                    doctorInfo.specialtyId = inputdata.specialtyId;
                    // doctorInfo.clinicId = inputdata.clinicId;
                    await doctorInfo.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: inputdata.doctorId,
                        priceId: inputdata.selectedPrice,
                        provinceId: inputdata.selectedProvince,
                        paymentId: inputdata.selectedPayment,
                        nameClinic: inputdata.nameClinic,
                        addressClinic: inputdata.addressClinic,
                        specialtyId: inputdata.specialtyId,
                        // clinicId: inputdata.clinicId,
                        note: inputdata.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id },
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {}

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item, index) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let exising = await db.Schedules.findAll({
                    where: { doctorId: data.doctorId, date: data.formattedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })
                let toCreate = _.differenceWith(schedule, exising, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })

                if (toCreate && toCreate.length > 0) {
                    await db.Schedules.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }

            resolve('')
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter .'
                })
            } else {
                let data = await db.Schedules.findAll({
                    where: { doctorId, date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = [];

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInfoById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {}

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoById,
    getProfileDoctorById
}