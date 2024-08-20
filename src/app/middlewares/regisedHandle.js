

module.exports = function authenticateToken(req, res, next) {

      const regised = req.cookies.uid;

      if(regised) {
        res.send("You have already registered your ticket !!")
      } 

      next()


   
    
    
  }