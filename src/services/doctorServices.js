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

let saveDetailInfoDoctor = (inputdata) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputdata.doctorId || !inputdata.contentHTML || !inputdata.contentMarkdown
                || !inputdata.action
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
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
                        doctorMarkdown.contentHTML = inputdata.contentHTML,
                            doctorMarkdown.contentMarkdown = inputdata.contentMarkdown,
                            doctorMarkdown.description = inputdata.description,
                            await doctorMarkdown.save()
                    }
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
                        }
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
                        {
                            model: db.Allcode, as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        }
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

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate
}