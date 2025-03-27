import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
    <h2 style="font-size: 20px; color: #333;">${subject}</h2>
    <p style="font-size: 18px; color: #555;">${text}</p>
  </div>
`;
  try {
    const info = await transporter.sendMail({
      from: `"NEUQueue System" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html: htmlContent,
    });
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
