import userServices from "../services/userServices";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //check email user exist
    //compare password

    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter !',
        })
    }
    let userData = await userServices.handleUserLogin(email, password)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleAllUsers = async (req, res) => {
    let id = req.query.id;
    if(!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing require parameters',
            users: []
        })
    }

    let users = await userServices.getAllUsers(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Done',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userServices.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userServices.updateUser(data)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing require parameter ."
        })
    }
    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
}

module.exports = {
    handleLogin: handleLogin,
    handleAllUsers: handleAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
}