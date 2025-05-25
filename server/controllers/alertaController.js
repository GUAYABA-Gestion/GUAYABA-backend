import {Mail} from "../middlewares/nodemailer.js"

export const Alerta = {
mailSend: async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({
                error: 'Missing required fields: email, subject, message'
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // to who encargado admins y ....
            subject: subject,
            text: message
        };

        const info = await Mail.sendAlertEmail(mailOptions);
        
        res.status(200).json({
            message: 'Alert sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error in alert endpoint:', error);
        res.status(500).json({
            error: 'Failed to process alert',
            details: error.message
        });
    }
    }
}