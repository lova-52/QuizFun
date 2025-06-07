import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Kết nối Supabase (thông tin từ file .env)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// Test route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Lấy danh sách categories
app.get('/api/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Lỗi khi lấy categories:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
    }

    const formattedCategories = await Promise.all(categories.map(async (category) => {
      let imageUrl = null;
      if (category.image_url) {
        const { data } = supabase.storage
          .from('project-bucket')
          .getPublicUrl(category.image_url);
        imageUrl = data.publicUrl;
      }

      return {
        id: category.id.toString(),
        title: category.name,
        description: category.description,
        image: imageUrl,
        quizCount: `${category.total_quizzes || 0}+ Quiz`
      };
    }));

    return res.json({ success: true, data: formattedCategories });
  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách quizzes theo categoryId
app.get('/api/quizzes', async (req, res) => {
  try {
    const { categoryId } = req.query; // Lấy categoryId từ query parameter

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'categoryId is required' });
    }

    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi khi lấy quizzes:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy danh sách quizzes' });
    }

    const formattedQuizzes = await Promise.all(quizzes.map(async (quiz) => {
      let imageUrl = null;
      if (quiz.image_url) {
        const { data } = supabase.storage
          .from('project-bucket')
          .getPublicUrl(quiz.image_url);
        imageUrl = data.publicUrl;
      }

      return {
        id: quiz.id.toString(),
        categoryId: quiz.category_id.toString(),
        title: quiz.title,
        description: quiz.description,
        image: imageUrl,
        questionCount: quiz.total_questions || 0,
        completions: quiz.play_count || 0,
        createdAt: quiz.created_at,
      };
    }));

    return res.json({
      success: true,
      data: formattedQuizzes,
    });
  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy top 6 quizzes phổ biến dựa trên play_count
app.get('/api/popular-quizzes', async (req, res) => {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('play_count', { ascending: false }) // Sắp xếp theo play_count giảm dần
      .limit(6); // Lấy top 6

    if (error) {
      console.error('Lỗi khi lấy popular quizzes:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy danh sách quizzes phổ biến' });
    }

    const formattedQuizzes = await Promise.all(quizzes.map(async (quiz) => {
      let imageUrl = null;
      if (quiz.image_url) {
        const { data } = supabase.storage
          .from('project-bucket')
          .getPublicUrl(quiz.image_url);
        imageUrl = data.publicUrl;
      }

      return {
        id: quiz.id.toString(),
        categoryId: quiz.category_id.toString(),
        title: quiz.title,
        description: quiz.description,
        image: imageUrl,
        questionCount: quiz.total_questions || 0,
        completions: quiz.play_count || 0,
        createdAt: quiz.created_at,
      };
    }));

    return res.json({
      success: true,
      data: formattedQuizzes,
    });
  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// Đăng ký
// API lấy danh sách users (CHO ADMIN) - LONG THÊM MỚI
app.get('/api/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('user')
      .select('id, name, email, role, created_at');

    if (error) {
      console.error('Lỗi khi lấy user:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy user' });
    }

    res.json({ success: true, users });
  } catch (err) {
    console.error('Lỗi server không mong muốn:', err);
    res.status(500).json({ message: 'Lỗi server không mong muốn' });
  }
});

// Đăng ký user mới
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

  // Kiểm tra email đã tồn tại chưa
  const { data: existingUsers, error: queryError } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (queryError) return res.status(500).json({ message: 'Lỗi server' });
  if (existingUsers.length > 0)
    return res.status(409).json({ message: 'Email đã được sử dụng' });

  const password_hash = await bcrypt.hash(password, 10);

  // Insert user mới vào DB
  const { error: insertError } = await supabase
    .from('user')
    .insert([{ name, email, password_hash, role: 'user' }]);

  if (insertError)
    return res.status(500).json({ message: 'Không thể tạo tài khoản' });

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

  // TODO: Tạo JWT token thực sự (hiện tại tạm dùng token giả)

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
