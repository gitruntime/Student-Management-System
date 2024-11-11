const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs").promises;
const ENV = process.env;

class EmailService {
  constructor() {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: true,
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(userEmail, username, resetToken) {
    try {
      // Read the template file
      const template = await fs.readFile(this.templatePath, "utf-8");

      // Create the reset link
      const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

      // Data to be injected into the template
      const templateData = {
        username: username,
        resetLink: resetLink,
        expiryTime: 24, // Password reset link expiry time in hours
        logoUrl: `${process.env.APP_URL}/images/logo.png`,
        companyName: "Your Company Name",
        companyAddress: "123 Company Street, City, Country",
        currentYear: new Date().getFullYear(),
      };

      // Render the template with EJS
      const htmlContent = await ejs.render(template, templateData, {
        async: true,
      });

      // Email options
      const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: userEmail,
        subject: "Reset Your Password",
        html: htmlContent,
      };

      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Password reset email sent: %s", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }
}

module.exports = new EmailService();
