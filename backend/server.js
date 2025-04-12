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

// Bắt đầu chạy server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@example.com' && password === '123456') {
      return res.json({ message: 'Đăng nhập thành công', token: 'fake-jwt-token' });
    } else {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  });
  