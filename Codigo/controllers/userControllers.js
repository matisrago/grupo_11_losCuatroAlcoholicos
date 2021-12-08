const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs')

const productsFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const User = require ('../models/user')


const usersControllers = {
    login: (req, res)=>{
        res.render("formDeLogin")
    },
    registro: (req,res)=>{
        res.render("formDeRegistro")
    },
    processLogin: (req,res) =>{
        let errors = validationResult(req);
        if(errors.isEmpty()){
        }else{
            return res.render('formDeLogin',{errors:errors.errors})
        }
    },
    
    processRegister: (req, res) =>{
        const resultadoValidation = validationResult(req);

        if (resultadoValidation.errors.length > 0){
            return res.render('formDeRegistro', {
                errors: resultadoValidation.mapped(),
                oldData: req.body
            });
        }
        let userInDB = User.findByField('email', req.body.email);

        if (userInDB) {
            return res.render ('formDeRegistro',{
                errors: {
                    email:{
                        msg: 'Este email ya  está registrado'
                    }
                },
                oldData: req.body
            });
        }



        let userToCreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            avatar: req.file.filename

        }

        User.create(userToCreate);
        return res.send('ok se guardo el usario');

    }

}
module.exports = usersControllers;