// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';                 // mã hóa mật khẩu
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Khởi tạo Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Route test
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
  }

  // Tìm user theo email
  const { data: users, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }

  if (!users || users.length === 0) {
    return res.status(401).json({ message: 'Email không tồn tại' +  users});
  }

  const user = users[0];

  // Kiểm tra mật khẩu bằng bcrypt
  // const isValidPassword = await bcrypt.compare(password, user.password_hash || '');
  const isValidPassword = user.password_hash === password;


  if (!isValidPassword) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng nha' +  user });
  }

  // Nếu hợp lệ, tạo token JWT hoặc fake token
  // Ở đây tạm tạo token giả, bạn nên thay bằng JWT thực tế
  const token = 'fake-jwt-token';

  return res.json({
    message: 'Đăng nhập thành công',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  // Kiểm tra email đã tồn tại chưa
  const { data: existingUsers, error: queryError } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (queryError) {
    console.error('Supabase error:', queryError.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }

  if (existingUsers && existingUsers.length > 0) {
    return res.status(409).json({ message: 'Email đã được sử dụng' });
  }

  // Mã hóa mật khẩu
  const password_hash = await bcrypt.hash(password, 10);

  // Thêm user mới
  const { data: newUser, error: insertError } = await supabase
    .from('user')
    .insert([{ name, email, password_hash, role: 'user' }]);

  if (insertError) {
    console.error('Supabase error:', insertError.message);
    return res.status(500).json({ message: 'Không thể tạo tài khoản' });
  }

  return res.status(201).json({ message: 'Đăng ký thành công!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});
