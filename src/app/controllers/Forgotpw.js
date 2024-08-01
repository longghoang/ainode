// const moment = require('moment');
const UserSchema = require('../models/User.model');
const nodemailer = require("nodemailer");
// const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');


class forgotpwController {
    index(req, res) {
        res.render('forgotpw')
    }
    //

    async sendcode (req, res, next) {
        try {

            // return res.send("ok")

            function generateRandomNumber() {
              const randomNumber = Math.floor(Math.random() * 9000) + 1000; 
              return randomNumber.toString();
            }
            
            
            const verificationCode = generateRandomNumber();
            const { email  } = req.body;
  
            const emailDb = await UserSchema.findOne({ email: email })
  
            if(!emailDb) {
              return res.json('Tài khoản này chưa được đăng ký')
            }
        
            const transporter = nodemailer.createTransport({
              port: 587,
              service: 'gmail',
              auth: {
                user: 'nguyenlonglqmb@gmail.com',
                pass: 'mufneepfkiqccqnd'
              },
              secure: true
            });
        
            
            await transporter.sendMail({
              from: 'nguyenlonglqmb@gmail.com', 
              to: emailDb.email, 
              subject: 'Hello', 
              text: `Mã xác nhận của bạn là: ${verificationCode}`, 
            });
  
            const expiryDate = new Date(Date.now() + 60 * 10000);
            const expiryDate2 = new Date(Date.now() + 360 * 10000); 
  
            
            // Đặt cookie 
            res.cookie('codeVerify', verificationCode, { expires: expiryDate, signed: true });
            res.cookie('emailID', email, { expires: expiryDate2, signed: true });
            
            res.json('send code complete')
  
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to send code', error: error.message });
  
          }

        }


        //changepass

        changepass(req, res) {
            res.render('changepw')
        }

        //verifycode
        async verifycode (req, res, next) {
            try {
                const codeVerify = req.signedCookies.codeVerify

                if(!codeVerify){
                  return res.status(404).json({ message: "Code is not Verify" })
                }
        
                const { code } = req.body
        
                if(code === codeVerify) {
                  
        
                  res.redirect('/forgotpw/changepass')
                } else {
                  return res.json('Mã xác nhận không tồn tại')
                }
        
                  
              }catch(error) {
                  next(error)
              }
    
            }

            ///savepw
            async savepw (req, res, next) {
                try {
                    const { email, newpass, verifypass } = req.body
          
                    if(newpass != verifypass) {
                      return res.json('Mật khẩu không khớp')
                    }
          
                
                    const hashpw = cryptojs.SHA256(newpass).toString();
          
                   
                    
          
                    await UserSchema.updateOne({ email: email }, { hashpw: hashpw })
          
                    res.redirect('/')
                      
                  }catch(error) {
                      next(error)
                  }
        
                }






}

module.exports = new forgotpwController()