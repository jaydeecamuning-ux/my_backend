import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const port = process.env.PORT || 10000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

let otpStore = {}; // temporary in-memory storage

// send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ success: false, error: "Email required" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dcruz.melvin.15@gmail.com",       // replace with your Gmail
      pass: "bykueazukmotixza"           // Gmail App Password (not your Gmail password)
    }
  });

  try {
    await transporter.sendMail({
      from: "OTP Service",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.send({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: "Failed to send email" });
  }
});

// verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    return res.send({ success: true, message: "Email verified!" });
  }
  res.status(400).send({ success: false, message: "Invalid OTP" });
});

app.listen(port, () => console.log("✅ Server running at http://localhost:" + port));
