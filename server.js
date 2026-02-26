const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware لقراءة البيانات من الـ body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// هذا يخلي السيرفر يخدم الملفات الثابتة (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// تعريف الـ Schema للمستخدمين
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  device_id: String,
  public_key: String
});

const User = mongoose.model('User', userSchema);

// Route للتسجيل
app.post('/register', async (req, res) => {
  try {
    const { email, password, device_id, public_key } = req.body;
    const newUser = new User({ email, password, device_id, public_key });
    await newUser.save();
    res.json({ success: true, message: "✅ User registered successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Route لتسجيل الدخول
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: "✅ Login successful", user });
    } else {
      res.json({ success: false, message: "❌ Invalid credentials" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// تشغيل السيرفر على كل الشبكة
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
