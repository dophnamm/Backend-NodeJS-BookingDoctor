import db from "../models/index";

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ['password'] },
                include: [ 
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
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
        } catch(e) {
            reject(e)
        }
    })
}

let saveDetailInfoDoctor = (inputdata) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(inputdata.id || !inputdata.contentHTML || !inputdata.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Markdown.create({
                    contentHTML: inputdata.contentHTML,
                    contentMarkdown: inputdata.contentMarkdown,
                    description: inputdata.description,
                    doctorId: inputdata.doctorId
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }
        } catch(e) {
            reject(e)
        }
    }) 
}

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id },
                    attributes: { exclude: ['password'] },
                    include: [
                        {   model: db.Markdown ,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {   model: db.Allcode, as: 'positionData', 
                            attributes: [ 'valueEn', 'valueVi' ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if(!data) data = {}

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorById
}