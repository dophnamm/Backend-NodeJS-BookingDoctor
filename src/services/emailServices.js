require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Healthy Care" <demoweb1209@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend)
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
            <h2> Cảm ơn quý khách đặt lịch khám tại Healthy Care</ >
            <p>Healthy Care thông báo lịch khám của quý khách đã được tiếp nhận và đang chờ xử lý.</p>
            <br>
            <h3>Xin chào, ${dataSend.patientName}</h3>
            <h3>Thông tin đặt lịch khám bệnh của bạn .<h3>
            <p>Thời gian: ${dataSend.time}</p>
            <p>Bác sĩ: ${dataSend.doctorName}</p>
            <br>
            <p>Kiểm tra thông tin lịch khám và để hoàn tất thủ tục đặt lịch khám bệnh, vui lòng bấm 
            <a href=${dataSend.redirectLink} target="_blank"> tại đây </a>
            để xác nhận lịch khám .</p>
            <p>Xin chân thành cảm quý khách, Healthy Care .</p>
        `
    }

    if (dataSend.language === 'en') {
        result = `
            <h2>Thank you for booking an appointment at Healthy Care</h2>
            <p>HHealthy Care informs you that your appointment has been received and is pending.</p>
            <br>
            <h3>Hello, ${dataSend.patientName}</h3>
            <h3>Your medical appointment information.<h3>
            <p>Time : ${dataSend.time}</p>
            <p>Doctor : ${dataSend.doctorName}</p>
            <br>
            <p>To check the schedule information and to complete the appointment booking procedure, please click
            <a href=${dataSend.redirectLink} target="_blank"> here </a>
            to confirm the appointment.</p>
            <p>Sincerely thank you, Healthy Care .</p>
        `
    }

    return result;
}

module.exports = { sendSimpleEmail }