var db = require('../config/connection')
const Promise = require('promise')
var bcrypt = require('bcryptjs');



module.exports = {


    usersignup: (userdata) => {
        return new Promise(async (resolve, reject) => {



            let user = await db.get().collection('user').findOne({ mailid: userdata.mailid });
            const state = {
                userexist: false,
                user:null
            }
            if (!user) {
                userdata.password = await bcrypt.hash(userdata.password, 10);
                db.get().collection('user').insertOne(userdata).then((data) => {
                    state.userexist =false
                    state.user=userdata
                    resolve(state)
                })
            } else {
                state.userexist = true
                resolve(state)
            }

        })

    },

    userlogin: (logindata) => {

        return new Promise(async (resolve, reject) => {


            let response = {
                status: false,
                usernotfound: false

            }
            
            let user = await db.get().collection('user').findOne({ mailid: logindata.mailid });
            if (user) {
                bcrypt.compare(logindata.password, user.password, (err, valid) => {
                    if (valid) {
                        response.status = true;
                        response.user = user

                        resolve(response)
                        // console.log('success b');
                    } else {
                        resolve(response)
                        // console.log(err);

                    }

                })
            } else {
                response.usernotfound = true
                resolve(response)
            }
        })

    }



}


