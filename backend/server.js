import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// Test route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

  // Kiểm tra tồn tại email
  const { data: existingUsers, error: queryError } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (queryError) return res.status(500).json({ message: 'Lỗi server' });
  if (existingUsers.length > 0)
    return res.status(409).json({ message: 'Email đã được sử dụng' });

  // Hash mật khẩu
  const password_hash = await bcrypt.hash(password, 10);

  // Thêm user
  const { data: newUser, error: insertError } = await supabase
    .from('user')
    .insert([{ name, email, password_hash, role: 'user' }]);

  if (insertError) return res.status(500).json({ message: 'Không thể tạo tài khoản' });

  return res.status(201).json({ message: 'Đăng ký thành công!' });
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

  const { data: users, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error) return res.status(500).json({ message: 'Lỗi server' });
  if (!users.length) return res.status(401).json({ message: 'Email không tồn tại' });

  const user = users[0];

  const isValidPassword = await bcrypt.compare(password, user.password_hash || '');
  if (!isValidPassword)
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

  // TODO: Tạo JWT token thực sự (hiện tạm token giả)
  const token = 'fake-jwt-token';

  return res.json({
    message: 'Đăng nhập thành công',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});
