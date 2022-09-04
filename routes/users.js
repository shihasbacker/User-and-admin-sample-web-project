var express = require('express');
var router = express.Router();
const userhelper = require('../helpers/userhelper')

var session;

/* GET users listing. */
router.get('/', function (req, res, next) {
  
  if (req.session.user) {
   let username=req.session.user.fname
    res.render('user/userhome',{username})
  }
  else {
    res.redirect('/loginpage')
  }

});

router.get('/loginpage', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/')
  } else {
    session=req.session
    res.render('user/userlogin',{session})
    

  }

});

router.get('/signuppage', function (req, res, next) {         //signup page

  if(req.session.user){
    res.redirect('/')
  }else{
    

session=req.session

console.log(session.userAlreadyExist);
  res.render('user/usersignup',{session})

  }


});

router.post('/signup', function (req, res, next) {             //signup action
  userhelper.usersignup(req.body).then((state) => {
    if(state.userexist){
      req.session.userAlreadyExist=true;
      res.redirect('/signuppage')
      
    }else{
      
      req.session.user=state.user;
      console.log(state.user);
      res.redirect('/')
      
    } 

    
  })

});
router.post('/login', function (req, res, next) {                      //login action
  userhelper.userlogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      // console.log(req.session.user);
      // console.log('success');
      res.redirect('/')

    }else if(response.usernotfound) {
      console.log('usernotfound');
      req.session.usernotfound=true;
      req.session.wrongpassword=false;
      res.redirect('/loginpage')
      
    }else{
      console.log('failed login');
      req.session.wrongpassword=true;
      req.session.usernotfound=false;
      res.redirect('/loginpage')

    }

  })                                                             

});

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})


module.exports = router;
