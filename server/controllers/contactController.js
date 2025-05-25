import { Mail } from "../middlewares/nodemailer.js";

export const Contact = {
  sendContactEmail: async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios."
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: `"${name}" <${process.env.EMAIL_USER}>`, 
      replyTo: email,
      subject: "Guayaba - Nuevo mensaje de contacto",
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
    };

    try {
      await Mail.sendAlertEmail(mailOptions);
      res.json({ success: true, message: "Correo enviado correctamente" });
    } catch (error) {
      console.error("Error al enviar correo:", error);
      res.status(500).json({ success: false, error: "Error al enviar el correo" });
    }
  }
};