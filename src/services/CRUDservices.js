import bcrypt from 'bcryptjs'
import db from "../models/index";

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

let createNewUser = async (data) => {
    return new Promise (async (resolve, reject) => {
        try {
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
            resolve('Success')
        } catch(e) {
            reject(e)
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({ raw: true })
            resolve(users)
        } catch(e) {
            reject(e)
        }
    })
}

let getUserInfoById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id},
                raw: true
            })
            if(user) {
                resolve(user)
            }else {
                resolve({})
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                
                await user.save();

                let allUsers = await db.User.findAll()
                resolve(allUsers);
            } else {
                resolve();
            }
        } catch(e) {
            reject(e)
        }
    })
}

let deleteUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            if(user) {
                await user.destroy()
            }
            resolve();
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUserById: deleteUserById,
}