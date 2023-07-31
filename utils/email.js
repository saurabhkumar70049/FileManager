import nodemailer from 'nodemailer';
import 'dotenv/config';


let mailTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user:process.env.EMAIL_USERID,
        pass:process.env.EMAIL_PASS
    }
})



async function sendEmail(to, subject, text){
    const mailDetails = {
        from:process.env.EMAIL_USERID,
        to,
        subject,
        text
    }
    mailTransport.sendMail(mailDetails, (err, data)=> {
        if(err){
            console.log(err);
        }
        else {
            console.log("Email send to successfully to ", to);
        }
    })
}

export default sendEmail;