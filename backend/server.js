import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Route mẫu
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === '123456') {
    return res.json({ message: 'Đăng nhập thành công', token: 'fake-jwt-token' });
  } else {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
});


app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  if (email === 'admin@example.com') {
    return res.status(409).json({ message: 'Email đã được sử dụng' });
  }

  return res.status(201).json({ message: 'Đăng ký thành công!' });
});


// ✅ Lúc này mới listen
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});
