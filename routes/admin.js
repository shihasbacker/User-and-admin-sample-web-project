var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
let adminhelper = require('../helpers/adminhelper')

var session;
/* GET home page. */
router.get('/admin', function (req, res, next) {
  if (req.session.admin) {
    adminhelper.getuserdata().then((data) => {
      res.render('admin/adminhome', { data });
    })

  } else {
    res.redirect('/adminloginpage')
  }

});

router.get('/adminloginpage', function (req, res, next) {
  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    session = req.session
    res.render('admin/adminlogin', { session });
  }
});

router.post('/adminlogin', function (req, res, next) {

  adminhelper.adminlogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin
      // console.log(req.session.admin);
      // console.log('success');
      res.redirect('/admin')

    } else if (response.usernotfound) {
      console.log('usernotfound');
      req.session.adminnotfound = true;
      req.session.wrongpassword = false;
      res.redirect('/adminloginpage')

    } else {
      console.log('failed login');
      req.session.wrongpassword = true;
      req.session.adminnotfound = false;
      res.redirect('/adminloginpage')

    }

  })

});

router.get('/adminlogout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/admin')
});
//CRUD


//add user
router.get('/adduser', (req, res) => {
  res.render('admin/addnewuser')
})

router.post('/addnewuser', (req, res) => {
  adminhelper.addnewuser(req.body).then(() => {
    res.redirect('/admin')
  })
})

//delete user
router.get('/delete-user/:_id', (req, res) => {
 let userid=req.params._id
 adminhelper.deleteuser(userid).then((data)=>{
  res.redirect('/admin')
 })
})
//update user
router.get('/update-user/:id', (req, res) => {
  let userid=req.params.id
  adminhelper.getOneUser(userid).then((userdata)=>{
  res.render('admin/updateuserdetails',{userdata})
  
    
  })
})

router.post('/updateUserData', (req, res) => {
  adminhelper.updateUserData(req.body).then((response) => {
    console.log(response);
    res.redirect('/admin')
  })
})

module.exports = router;
