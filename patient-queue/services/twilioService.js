const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;

const sendNotification = async (phone, message) => {
    try {
        await client.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: phone
        });
    } catch (error) {
        console.error('Twilio SMS Error:', error);
    }
};

module.exports = sendNotification;
