import db from "../models/index";
import CRUDservices from "../services/CRUDservices"; 

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch(e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDservices.createNewUser(req.body);
    console.log(message);
    return res.send('POST')
}

let displayCRUD = async (req, res) => {
    let data = await CRUDservices.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id
    if(userId) {
        let userData = await CRUDservices.getUserInfoById(userId)
        if(userData) {
            return res.render('editCRUD.ejs', { userData })
        }
    } else {
        return res.send('Eidt User')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDservices.updateUser(data)
    return res.render('displayCRUD.ejs', {dataTable: allUsers})
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if(id) {
        await CRUDservices.deleteUserById(id)
        return res.send('delete success')
    } else {
        return res.send('User not found')
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}
