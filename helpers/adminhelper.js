var db = require('../config/connection')
const Promise = require('promise')

var bcrypt = require('bcryptjs');


const { ObjectId } = require('mongodb')

module.exports = {


    adminlogin: (adminlogin) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                status: false,
                usernotfound: false

            }
            // adminlogin.password = await bcrypt.hash(adminlogin.password, 10);
            // db.get().collection('adminlogin').insertOne(adminlogin)

            let admin = await db.get().collection('adminlogin').findOne({ mailid: adminlogin.mailid });
            if (admin) {
                bcrypt.compare(adminlogin.password, admin.password, (err, valid) => {
                    if (valid) {
                        response.status = true;
                        response.admin = admin

                        resolve(response)
                        console.log('success b');
                    } else {
                        resolve(response)
                        console.log(err);

                    }

                })
            } else {
                response.usernotfound = true
                resolve(response)
            }
         })
     },

    getuserdata: () => {
        return new Promise(async (resolve, reject) => {

            let users = await db.get().collection('user').find({}).toArray()
            resolve(users)

        })

    },

    addnewuser: (userdata) => {
        return new Promise(async (resolve, reject) => {
            userdata.password = await bcrypt.hash(userdata.password, 10);
            db.get().collection('user').insertOne(userdata).then((data) => {
                resolve(data)
            })
        })
    },

    deleteuser: (userid) => {
     
        return new Promise((resolve, reject) => {


            db.get().collection('user').remove({ _id: ObjectId(userid) }).then((response) => {
                console.log(ObjectId(userid))
                resolve(true)

            })
        })

    },

    getOneUser:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let userdata=await db.get().collection('user').find({_id:ObjectId(userid)}).toArray();
            
                resolve(userdata)
                
            
        })
    },

    updateUserData:(updatedData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('user').update({_id:ObjectId(updatedData._id)},{$set:{
                fname:updatedData.fname,
                lname:updatedData.lname,
                mailid:updatedData.mailid,
                place:updatedData.place,
                pincode:updatedData.pincode
            }}).then((response)=>{
                resolve(true)
            })
        })
    }
}