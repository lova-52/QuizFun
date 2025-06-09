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

// Lấy chi tiết một quiz theo quizId
app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        categories (name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Lỗi khi lấy quiz:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết quiz' });
    }

    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }

    let imageUrl = null;
    if (quiz.image_url) {
      const { data } = supabase.storage
        .from('project-bucket')
        .getPublicUrl(quiz.image_url);
      imageUrl = data.publicUrl;
    }

    const formattedQuiz = {
      id: quiz.id.toString(),
      categoryId: quiz.category_id.toString(),
      categoryName: quiz.categories?.name || 'Unknown Category',
      title: quiz.title,
      description: quiz.description,
      image: imageUrl,
      time: quiz.time_limit || 0,
      questionCount: quiz.total_questions || 0,
      completions: quiz.play_count || 0,
      createdAt: quiz.created_at,
    };

    return res.json({
      success: true,
      data: formattedQuiz,
    });
  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});
// API lấy câu hỏi và đáp án của một quiz
app.get('/api/quizzes/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin quiz trước
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy quiz' 
      });
    }

    // Lấy tất cả câu hỏi của quiz, sắp xếp theo order
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', id)
      .order('order', { ascending: true });

    if (questionsError) {
      console.error('Lỗi khi lấy questions:', questionsError);
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi lấy câu hỏi' 
      });
    }

    // Lấy tất cả đáp án cho các câu hỏi này
    const questionIds = questions.map(q => q.id);
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*')
      .in('question_id', questionIds);

    if (answersError) {
      console.error('Lỗi khi lấy answers:', answersError);
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi lấy đáp án' 
      });
    }

    // Nhóm đáp án theo question_id
    const answersGrouped = answers.reduce((acc, answer) => {
      if (!acc[answer.question_id]) {
        acc[answer.question_id] = [];
      }
      acc[answer.question_id].push({
        id: answer.id,
        content: answer.content,
        isCorrect: answer.is_correct,
        isPersonality: answer.is_personality || null
      });
      return acc;
    }, {});

    // Format dữ liệu câu hỏi
    const formattedQuestions = questions.map((question, index) => ({
      id: question.id,
      question: question.content,
      type: question.type, // 'single_choice' hoặc 'multi_choice'
      order: question.order,
      answers: answersGrouped[question.id] || []
    }));

    // Format thông tin quiz
    const quizInfo = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.time_limit, // thời gian làm bài (phút)
      totalQuestions: quiz.total_questions,
      questionCount: formattedQuestions.length
    };

    return res.json({
      success: true,
      data: {
        quiz: quizInfo,
        questions: formattedQuestions
      }
    });

  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});

// API submit kết quả quiz (tùy chọn - để lưu kết quả)
app.post('/api/quizzes/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent, userId } = req.body;

    // Validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dữ liệu đáp án không hợp lệ' 
      });
    }

    // Lấy đáp án đúng từ database
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        id,
        answers (id, is_correct)
      `)
      .eq('quiz_id', id);

    if (questionsError) {
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy đáp án đúng' 
      });
    }

    // Tính điểm
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    answers.forEach(userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (!question) return;

      const correctAnswerIds = question.answers
        .filter(a => a.is_correct)
        .map(a => a.id);

      // Kiểm tra đáp án của user
      const userAnswerIds = Array.isArray(userAnswer.selectedAnswers) 
        ? userAnswer.selectedAnswers 
        : [userAnswer.selectedAnswers];

      // So sánh đáp án
      const isCorrect = correctAnswerIds.length === userAnswerIds.length &&
        correctAnswerIds.every(id => userAnswerIds.includes(id));

      if (isCorrect) correctAnswers++;
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Tăng play_count cho quiz
    await supabase
      .from('quizzes')
      .update({ 
        play_count: supabase.raw('play_count + 1') 
      })
      .eq('id', id);

    // Trả về kết quả
    return res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions,
        timeSpent,
        passed: score >= 60 // Điều kiện đạt (có thể tùy chỉnh)
      }
    });

  } catch (error) {
    console.error('Lỗi submit quiz:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
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
