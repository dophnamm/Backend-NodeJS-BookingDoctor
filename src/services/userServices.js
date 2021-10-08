import db from "../models/index";
import bcrypt from "bcryptjs"; 

const salt = bcrypt.genSaltSync(10);
let hashPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch(e) {
            reject(e)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: { email },
            })

            if(user) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch(e) {
            reject(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if(isExist){
                //compare password
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: {email},
                    raw: true
                })

                if(user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Done';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found.'
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Please try other email.`
            }
            resolve(userData)
        } catch(e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if(userId === 'ALL') {
                users = db.User.findAll({
                    attributes: {exclude: ['password']}
                })
            } 
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {exclude: ['password']},
                })
            }
            resolve(users)
        } catch(e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Error, email is already in used !'
                })
            } else {
                let hashPasswordFromBycypt = await hashPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBycypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                    phonenumber: data.phonenumber,
                })
                resolve({
                    errCode: 0,
                    message: 'Done'
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

let deleteUser = (id) => {
    return new Promise (async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: {id}
        })
        if(!foundUser) {
            resolve({
                errCode: 2,
                errMessage: 'The user is not exist'
            })
        }
        await db.User.destroy({
            where: {id}
        })
        resolve({
            errCode: 0,
            errMessage: 'The user is deleted'
        })
    })
}

let updateUser = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Error !'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            })
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.addressName = data.address;
                
                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update success .'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found ."
                });
            }
        }catch(e) {
            reject(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "missing require !"
                })
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res)
            }
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService,
}