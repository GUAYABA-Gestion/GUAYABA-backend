
import nodemailer from 'nodemailer';

// Exportar un objeto con todas las funciones del controlador
class MailService {
  constructor() {
      this.transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'Gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
      });
  }

  async sendAlertEmail(mailOptions) {
      try {
          return await this.transporter.sendMail(mailOptions);
      } catch (error) {
          throw new Error(`Email sending failed: ${error.message}`);
      }
  }

}
export const Mail = new MailService;