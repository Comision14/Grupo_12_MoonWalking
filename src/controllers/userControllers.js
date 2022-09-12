const {validationResult} = require('express-validator');
const { loadUsers, storeUsers } = require('../data/productModule');
const bcryptjs = require('bcryptjs');


module.exports={
    login: (req, res) =>{
        return res.render('./users/login')
    },
    register: (req, res) => {
        return res.render('./users/register')
    },
    updateProfile: (req, res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
           const {firstName, lastName, email, password} = req.body;
           const users = loadUsers();

           const newUser = {
            id : users[users.length -1] ? users[users.length -1].id + 1 : 1,
            firstName : firstName.trim(),
            lastName : lastName.trim(),
            dni : null,
            celular : null,
            email : email.trim(),
            password : bcryptjs.hashSync(password.trim(), 10),
            calle : null,
            numero : null,
            piso : null,
            cp : null,
            city : null,
            province: null,
            avatar: null,
            rol: 'user'
           }
           const userModify = [...users, newUser];
           storeUsers(userModify);
           return res.redirect('/users/login')

        } else {
            return res.render('users/register', {
                errors : errors.mapped(),
                old : req.body
            })
        }
    },
    processLogin : (req, res) => {
        const errors = validationResult(req)

        if(errors.isEmpty()){
            let {id, firstName, image, rol} = loadUsers().find(user => user.email === req.body.email)
            req.session.userLogin = {
                id,
                firstName,
                image,
                rol
            }
            return res.redirect('./profile')
        }else {
            return res.render('./users/login', {
               errors : errors.mapped()
            })
        }
    },
    profile: (req, res) => {
        let user = loadUsers().find(user => user.id === req.session.userLogin.id);
        return res.render('./users/profile', {
            user,
            cities : require('../data/cities'),
            provinces : require('../data/provinces')
        })
    },
    updateChangesProfile : (req, res) => {

        const {firstName, lastName, dni, celular, email, calle, numero, piso, cp, city, province} = req.body;

        let usersModify = loadUsers().map(user => {
            if(user.id === +req.params.id){
                return {
                    ...user,
                    ...req.body,
                    image : req.file ? req.file.filename : req.session.userLogin.image
                }
            }
            return user
        });
    },

    logout : (req, res) => {
        req.session.destroy()
        return res.redirect('/')
    } ,
    usersList: (req, res) => {
        return res.render('./users/usersList')
    }
}
