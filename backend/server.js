import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Import multer để xử lý file upload
import multer from 'multer';
import path from 'path';
// Configure multer for file upload 
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh (jpeg, jpg, png, gif, webp)'));
    }
  }
});



dotenv.config();

// Kết nối Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
app.use(cors());
// Sửa bodyParser để tăng giới hạn
app.use(bodyParser.json({ limit: '50mb' })); // ← SỬA: Tăng từ default lên 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // ← THÊM


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
    const { categoryId } = req.query;

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
      .order('play_count', { ascending: false })
      .limit(6);

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

    // Lấy tất cả câu hỏi của quiz, sắp xếp theo order (bao gồm cả question_image)
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
    // Format dữ liệu câu hỏi với URL ảnh
    const formattedQuestions = await Promise.all(questions.map(async (question, index) => {
  let questionImageUrl = null;
  
  // ← SỬA: Xử lý đúng question_image
  if (question.question_image) {
    if (question.question_image.startsWith('http')) {
      // Đã là full URL
      questionImageUrl = question.question_image;
    } else {
      // Là file path, tạo public URL
      const { data } = supabase.storage
        .from('project-bucket')
        .getPublicUrl(question.question_image);
      questionImageUrl = data.publicUrl;
    }
  }

  return {
    id: question.id,
    question: question.content,
    questionImage: questionImageUrl, // ← SỬA: Đảm bảo có URL đúng
    type: question.type || 'single_choice', // ← ĐẢM BẢO có type

    order: question.order,
    answers: answersGrouped[question.id] || []
  };
}));

    const quizInfo = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.time_limit,
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

// API submit kết quả quiz
app.post('/api/quizzes/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent, userId, quizType, totalQuestions } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dữ liệu đáp án không hợp lệ' 
      });
    }

    // Kiểm tra xem userId có được cung cấp không
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID không được cung cấp' 
      });
    }

    // Lấy dữ liệu quiz và câu hỏi
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('quiz_type, play_count')
      .eq('id', id)
      .single();

    if (quizError || !quiz) {
      return res.status(500).json({ 
        success: false, 
        message: 'Không tìm thấy quiz' 
      });
    }

    // Lấy tất cả câu hỏi của quiz với đáp án
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, content, answers (id, content, is_correct, is_personality)')
      .eq('quiz_id', id)
      .order('order', { ascending: true });

    if (questionsError) {
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy câu hỏi và đáp án' 
      });
    }

    let score = 0;
    let correctAnswers = 0;
    const totalQuestionsCount = questions.length;
    let personalityCounts = {};
    const detailedResults = [];

    // Tạo user_quiz session trước
    const { data: userQuiz, error: userQuizError } = await supabase
      .from('user_quizzes')
      .insert([{
        user_id: userId,
        quiz_id: id,
        quiz_type: quiz.quiz_type,
        started_at: new Date(Date.now() - (timeSpent * 1000)).toISOString(),
        finished_at: new Date().toISOString(),
        result: null // Sẽ cập nhật sau
      }])
      .select()
      .single();

    if (userQuizError) {
      console.error('Lỗi tạo user_quiz:', userQuizError);
      return res.status(500).json({
        success: false,
        message: 'Lỗi lưu session quiz'
      });
    }

   // Xử lý tính điểm và tạo chi tiết kết quả
for (const userAnswer of answers) {
  const question = questions.find(q => q.id === userAnswer.questionId);
  if (!question) continue;

  const userAnswerIds = Array.isArray(userAnswer.selectedAnswers) 
    ? userAnswer.selectedAnswers 
    : [userAnswer.selectedAnswers];

  // Xử lý riêng biệt cho từng loại quiz
  if (quiz.quiz_type === 'iq') {
    // IQ Quiz: Tính điểm dựa trên đáp án đúng
    const correctAnswerIds = question.answers
      .filter(a => a.is_correct)
      .map(a => a.id);

    // ← SỬA: Đổi tên biến để tránh conflict
    const selectedAnswerObjs = question.answers.filter(a => userAnswerIds.includes(a.id));
    const correctAnswerObjs = question.answers.filter(a => a.is_correct);
    
    // Tạo text hiển thị
    const selectedAnswerText = selectedAnswerObjs.map(a => a.content).join(', ') || 'Không chọn';
    const correctAnswerText = correctAnswerObjs.map(a => a.content).join(', ') || 'N/A';

    // Logic tính điểm
    let isCorrect = false;
    
    if (question.type === 'multi_choice') {
      // Multi-choice: Phải chọn ĐÚNG TẤT CẢ đáp án đúng, không chọn thừa
      isCorrect = correctAnswerIds.length === userAnswerIds.length &&
        correctAnswerIds.every(id => userAnswerIds.includes(id)) &&
        userAnswerIds.every(id => correctAnswerIds.includes(id));
    } else {
      // Single-choice: Logic cũ
      isCorrect = correctAnswerIds.length === userAnswerIds.length &&
        correctAnswerIds.every(id => userAnswerIds.includes(id));
    }

    if (isCorrect) {
      score++;
      correctAnswers++; // ← SỬA: Dùng biến đã khai báo ở đầu
    }

    // Tạo chi tiết với text đúng
    detailedResults.push({
      questionId: question.id,
      questionContent: userAnswer.questionContent || question.content,
      selectedAnswer: selectedAnswerText,
      correctAnswer: correctAnswerText,
      isCorrect: isCorrect,
      options: question.answers || []
    });

    // Lưu user_answers cho IQ quiz
    for (const selectedAnswerId of userAnswerIds) {
      const selectedAnswerInfo = question.answers.find(a => a.id === selectedAnswerId);
      const isAnswerCorrect = selectedAnswerInfo?.is_correct || false;

      await supabase
        .from('user_answers')
        .insert([{
          user_quiz_id: userQuiz.id,
          question_id: question.id,
          answer_id: selectedAnswerId,
          is_correct: isAnswerCorrect,
          finished_at: new Date().toISOString()
        }]);
    }

  } else if (quiz.quiz_type === 'personality') {
    // Personality quiz logic giữ nguyên
    question.answers.forEach(answer => {
      if (userAnswerIds.includes(answer.id)) {
        const personality = answer.is_personality;
        if (personality) {
          personalityCounts[personality] = (personalityCounts[personality] || 0) + 1;
        }
      }
    });

    // Lưu user_answers cho personality quiz
    for (const selectedAnswerId of userAnswerIds) {
      await supabase
        .from('user_answers')
        .insert([{
          user_quiz_id: userQuiz.id,
          question_id: question.id,
          answer_id: selectedAnswerId,
          is_correct: true,
          finished_at: new Date().toISOString()
        }]);
    }
  }
}


// ← SỬA: Tính kết quả cuối cùng HOÀN TOÀN riêng biệt
if (quiz.quiz_type === 'personality') {
  // Tìm personality type chiếm ưu thế
  let personalityType = 'balanced';
  let maxCount = 0;
  
  console.log('personalityCounts:', personalityCounts); // Debug
  
  for (const [key, value] of Object.entries(personalityCounts)) {
    if (value > maxCount) {
      personalityType = key;
      maxCount = value;
    }
  }

  console.log('Final personalityType:', personalityType); // Debug

  // Cập nhật kết quả personality
  const finalResult = JSON.stringify({ 
    personalityType, 
    personalityCounts 
  });

  await supabase
    .from('user_quizzes')
    .update({ result: finalResult })
    .eq('id', userQuiz.id);

  // Cập nhật play_count
  await supabase
    .from('quizzes')
    .update({ play_count: (quiz.play_count || 0) + 1 })
    .eq('id', id);

  // Trả kết quả personality
  return res.json({
    success: true,
    data: {
      totalQuestions: totalQuestionsCount,
      timeSpent,
      personalityType, // ← QUAN TRỌNG
      quizType: quiz.quiz_type,
      completionRate: 100,
      detailedResults: [],
      isPersonalityQuiz: true
    }
  });

} else {
  // IQ Quiz
  const finalScore = Math.round((score / totalQuestionsCount) * 100);
  
  const finalResult = JSON.stringify({ 
    score: finalScore, 
    passed: finalScore >= 60 
  });

  await supabase
    .from('user_quizzes')
    .update({ result: finalResult })
    .eq('id', userQuiz.id);

  // Cập nhật play_count
  await supabase
    .from('quizzes')
    .update({ play_count: (quiz.play_count || 0) + 1 })
    .eq('id', id);

  return res.json({
    success: true,
    data: {
      score: finalScore,
      totalQuestions: totalQuestionsCount,
      correctAnswers: correctAnswers,
      timeSpent,
      personalityType: 'balanced',
      passed: finalScore >= 60,
      quizType: quiz.quiz_type,
      completionRate: 100,
      detailedResults: detailedResults,
      isPersonalityQuiz: false
    }
  });
}


  } catch (error) {
    console.error('Lỗi submit quiz:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});




// Đăng ký
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

  const { data: existingUsers, error: queryError } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (queryError) return res.status(500).json({ message: 'Lỗi server' });
  if (existingUsers.length > 0)
    return res.status(409).json({ message: 'Email đã được sử dụng' });

  const password_hash = await bcrypt.hash(password, 10);

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

  const token = 'fake-jwt-token';

  return res.json({
    message: 'Đăng nhập thành công',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// API lấy danh sách users
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

// API xóa user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('user')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa user:', error);
      return res.status(500).json({ success: false, message: 'Xóa tài khoản thất bại' });
    }

    return res.json({ success: true, message: 'Xóa tài khoản thành công' });
  } catch (err) {
    console.error('Lỗi server không mong muốn:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// API lấy tất cả quizzes cho admin
app.get('/api/admin/quizzes', async (req, res) => {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        categories (name)
      `)
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
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        categoryName: quiz.categories?.name || 'Unknown Category',
        categoryId: quiz.category_id,
        image: imageUrl,
        totalQuestions: quiz.total_questions || 0,
        playCount: quiz.play_count || 0,
        timeLimit: quiz.time_limit,
        quizType: quiz.quiz_type,
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

// API xóa quiz
app.delete('/api/admin/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa user_answers trước
    const { error: userAnswersError } = await supabase
      .from('user_answers')
      .delete()
      .in('question_id', 
        (await supabase.from('questions').select('id').eq('quiz_id', id)).data?.map(q => q.id) || []
      );

    // Xóa user_quizzes
    const { error: userQuizzesError } = await supabase
      .from('user_quizzes')
      .delete()
      .eq('quiz_id', id);

    // Xóa answers
    const { error: answersError } = await supabase
      .from('answers')
      .delete()
      .in('question_id', 
        (await supabase.from('questions').select('id').eq('quiz_id', id)).data?.map(q => q.id) || []
      );

    // Xóa questions
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .eq('quiz_id', id);

    // Cuối cùng xóa quiz
    const { error: quizError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);

    if (quizError) {
      console.error('Lỗi khi xóa quiz:', quizError);
      return res.status(500).json({ success: false, message: 'Xóa quiz thất bại' });
    }

    return res.json({ success: true, message: 'Xóa quiz thành công' });
  } catch (err) {
    console.error('Lỗi server không mong muốn:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// API upload hình ảnh quiz 
app.post('/api/admin/quizzes/upload-image', upload.single('quizImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const file = req.file;
    const fileName = `quiz-${Date.now()}-${file.originalname}`;
    const filePath = `quiz-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-bucket')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Lỗi upload Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi upload hình ảnh'
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-bucket')
      .getPublicUrl(filePath);

    return res.json({
      success: true,
      data: {
        fileName: fileName,
        filePath: filePath,
        imageUrl: urlData.publicUrl
      }
    });

  } catch (error) {
    console.error('Lỗi upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});


// API upload hình ảnh câu hỏi (thêm sau API upload quiz image)
app.post('/api/admin/questions/upload-image', upload.single('questionImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    const file = req.file;
    const fileName = `question-${Date.now()}-${file.originalname}`;
    const filePath = `question-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-bucket')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Lỗi upload Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi upload hình ảnh câu hỏi'
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-bucket')
      .getPublicUrl(filePath);

    return res.json({
      success: true,
      data: {
        fileName: fileName,
        filePath: filePath,
        imageUrl: urlData.publicUrl
      }
    });

  } catch (error) {
    console.error('Lỗi upload question image:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});


// API tạo quiz mới
app.post('/api/admin/quizzes', async (req, res) => {
  try {
    const { title, description, categoryId, timeLimit, quizType, questions, imageUrl } = req.body;


    if (!title || !description || !categoryId || !questions || questions.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập đầy đủ thông tin quiz' 
      });
    }

    // Tạo quiz mới
    const { data: newQuiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([{
        title,
        description,
        category_id: categoryId,
        time_limit: timeLimit || 0,
        quiz_type: quizType || 'iq',
        total_questions: questions.length,
        image_url: imageUrl || null  // ← THÊM DÒNG NÀY

      }])
      .select()
      .single();

    if (quizError) {
      console.error('Lỗi khi tạo quiz:', quizError);
      return res.status(500).json({ success: false, message: 'Tạo quiz thất bại' });
    }

    // Tạo questions và answers
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      const { data: newQuestion, error: questionError } = await supabase
  .from('questions')
  .insert([{
    quiz_id: newQuiz.id,
    content: question.content,
    type: question.type || 'single_choice',
    order: i + 1,
      question_image: question.imageUrl || null  // ← THÊM dòng này
  }])
  .select()
  .single();


      if (questionError) {
        console.error('Lỗi khi tạo question:', questionError);
        continue;
      }

      // Tạo answers cho question
      const answersToInsert = question.answers.map(answer => ({
        question_id: newQuestion.id,
        content: answer.content,
        is_correct: answer.isCorrect || false,
        is_personality: answer.isPersonality || null
      }));

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (answersError) {
        console.error('Lỗi khi tạo answers:', answersError);
      }
    }

    // Cập nhật total_quizzes trong category
    const { data: category } = await supabase
      .from('categories')
      .select('total_quizzes')
      .eq('id', categoryId)
      .single();

    if (category) {
      await supabase
        .from('categories')
        .update({ total_quizzes: (category.total_quizzes || 0) + 1 })
        .eq('id', categoryId);
    }

    return res.json({
      success: true,
      message: 'Tạo quiz thành công',
      data: newQuiz
    });

  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});


// API lấy quiz để edit - THÊM question_image
 // API lấy quiz để edit - SỬA CÁCH TẠO PUBLIC URL
app.get('/api/admin/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;

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

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, content, type, order, question_image, answers (id, content, is_correct, is_personality)')
      .eq('quiz_id', id)
      .order('order', { ascending: true });

    if (questionsError) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy câu hỏi'
      });
    }

    // ← SỬA: Xử lý đúng cách tạo public URL
    const formattedQuestions = questions.map((question) => {
      let questionImageUrl = null;
      
      if (question.question_image) {
        // ← SỬA: Kiểm tra xem đã là full URL chưa
        if (question.question_image.startsWith('http')) {
          // Đã là full URL
          questionImageUrl = question.question_image;
        } else {
          // Là file path, cần tạo public URL
          const { data } = supabase.storage
            .from('project-bucket')
            .getPublicUrl(question.question_image);
          questionImageUrl = data.publicUrl;
        }
      }

      return {
        id: question.id,
        content: question.content,
        type: question.type,
        order: question.order,
        imageUrl: questionImageUrl,
        imagePreview: questionImageUrl,
        imageFile: null,
        answers: question.answers.map(answer => ({
          id: answer.id,
          content: answer.content,
          isCorrect: answer.is_correct,
          isPersonality: answer.is_personality
        }))
      };
    });

    return res.json({
      success: true,
      data: {
        ...quiz,
        questions: formattedQuestions
      }
    });

  } catch (error) {
    console.error('Lỗi lấy quiz:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});



// API cập nhật quiz - ĐÃ THÊM SUPPORT CHO QUESTION IMAGE
app.put('/api/admin/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, timeLimit, quizType, questions, imageUrl } = req.body;

    console.log('=== BẮT ĐẦU CẬP NHẬT QUIZ ===');
    console.log('Quiz ID:', id);
    console.log('Số questions mới:', questions.length);

    if (!title || !description || !categoryId || !questions || questions.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập đầy đủ thông tin quiz' 
      });
    }

    // BƯỚC 1: Cập nhật thông tin quiz
    const { error: quizUpdateError } = await supabase
      .from('quizzes')
      .update({
        title,
        description,
        category_id: categoryId,
        time_limit: timeLimit || 0,
        quiz_type: quizType || 'iq',
        total_questions: questions.length,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (quizUpdateError) {
      console.error('Lỗi cập nhật quiz:', quizUpdateError);
      return res.status(500).json({ success: false, message: 'Cập nhật quiz thất bại' });
    }

    console.log('✅ Cập nhật thông tin quiz thành công');

    // BƯỚC 2: XÓA DỮ LIỆU CŨ THEO THỨ TỰ ĐÚNG
    console.log('🗑️ Bắt đầu xóa dữ liệu cũ theo thứ tự...');

    // 2.1: Lấy question IDs của quiz này
    const { data: oldQuestions, error: getQuestionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('quiz_id', id);

    if (getQuestionsError) {
      console.error('Lỗi lấy questions:', getQuestionsError);
      return res.status(500).json({ success: false, message: 'Lỗi lấy questions cũ' });
    }

    if (oldQuestions && oldQuestions.length > 0) {
      const questionIds = oldQuestions.map(q => q.id);
      console.log('Question IDs cần xóa:', questionIds);

      // 2.2: Lấy answer IDs của các questions này
      const { data: oldAnswers, error: getAnswersError } = await supabase
        .from('answers')
        .select('id')
        .in('question_id', questionIds);

      if (getAnswersError) {
        console.error('Lỗi lấy answers:', getAnswersError);
        return res.status(500).json({ success: false, message: 'Lỗi lấy answers cũ' });
      }

      if (oldAnswers && oldAnswers.length > 0) {
        const answerIds = oldAnswers.map(a => a.id);
        console.log('Answer IDs cần xóa:', answerIds);

        // 2.3: XÓA USER_ANSWERS TRƯỚC (bảng con)
        const { error: deleteUserAnswersError } = await supabase
          .from('user_answers')
          .delete()
          .in('answer_id', answerIds);

        if (deleteUserAnswersError) {
          console.error('Lỗi xóa user_answers:', deleteUserAnswersError);
          return res.status(500).json({ success: false, message: 'Lỗi xóa user_answers' });
        }

        console.log('✅ Xóa user_answers thành công');

        // 2.4: XÓA ANSWERS (bảng cha của user_answers)
        const { error: deleteAnswersError } = await supabase
          .from('answers')
          .delete()
          .in('question_id', questionIds);

        if (deleteAnswersError) {
          console.error('Lỗi xóa answers:', deleteAnswersError);
          return res.status(500).json({ success: false, message: 'Lỗi xóa answers' });
        }

        console.log('✅ Xóa answers thành công');
      }

      // 2.5: XÓA QUESTIONS (bảng cha của answers)
      const { error: deleteQuestionsError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', id);

      if (deleteQuestionsError) {
        console.error('Lỗi xóa questions:', deleteQuestionsError);
        return res.status(500).json({ success: false, message: 'Lỗi xóa questions' });
      }

      console.log('✅ Xóa questions thành công');
    }

    // BƯỚC 3: TẠO DỮ LIỆU MỚI
    console.log('🆕 Bắt đầu tạo dữ liệu mới...');

    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const questionData = questions[questionIndex];
      
      console.log(`📝 Tạo question ${questionIndex + 1}: "${questionData.content}"`);
      console.log(`🖼️ Image URL cho question ${questionIndex + 1}:`, questionData.imageUrl);

      // Tạo question với image
      const { data: newQuestion, error: questionError } = await supabase
        .from('questions')
        .insert([{
          quiz_id: parseInt(id),
          content: questionData.content.trim(),
          type: questionData.type || 'single_choice',
          order: questionIndex + 1,
          question_image: questionData.imageUrl || null  // ← ĐÃ CÓ: Lưu image path
        }])
        .select('id')
        .single();

      if (questionError) {
        console.error(`❌ Lỗi tạo question ${questionIndex + 1}:`, questionError);
        return res.status(500).json({ 
          success: false, 
          message: `Lỗi tạo câu hỏi ${questionIndex + 1}: ${questionError.message}` 
        });
      }

      const questionId = newQuestion.id;
      console.log(`✅ Question ${questionIndex + 1} tạo thành công với ID: ${questionId}`);

      // Tạo answers
      if (questionData.answers && questionData.answers.length > 0) {
        const validAnswers = questionData.answers.filter(ans => ans.content && ans.content.trim() !== '');
        
        console.log(`📋 Tạo ${validAnswers.length} answers cho question ${questionIndex + 1}`);

        for (let answerIndex = 0; answerIndex < validAnswers.length; answerIndex++) {
          const answerData = validAnswers[answerIndex];
          
          const { error: answerError } = await supabase
            .from('answers')
            .insert([{
              question_id: questionId,
              content: answerData.content.trim(),
              is_correct: answerData.isCorrect || false,
              is_personality: answerData.isPersonality || null
            }]);

          if (answerError) {
            console.error(`❌ Lỗi tạo answer ${answerIndex + 1}:`, answerError);
            return res.status(500).json({ 
              success: false, 
              message: `Lỗi tạo đáp án ${answerIndex + 1}` 
            });
          }
        }

        console.log(`✅ Tạo answers cho question ${questionIndex + 1} thành công`);
      }
    }

    console.log('🎉 HOÀN THÀNH CẬP NHẬT QUIZ');

    return res.json({
      success: true,
      message: 'Cập nhật quiz thành công'
    });

  } catch (error) {
    console.error('💥 LỖI NGHIÊM TRỌNG:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Lỗi server: ${error.message}` 
    });
  }
});





// API cập nhật role user
app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role không hợp lệ. Chỉ chấp nhận "admin" hoặc "user"' 
      });
    }

    // Kiểm tra user tồn tại
    const { data: existingUser, error: checkError } = await supabase
      .from('user')
      .select('id, role')
      .eq('id', id)
      .single();

    if (checkError || !existingUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    // Cập nhật role
    const { error: updateError } = await supabase
      .from('user')
      .update({ role: role })
      .eq('id', id);

    if (updateError) {
      console.error('Lỗi khi cập nhật role:', updateError);
      return res.status(500).json({ 
        success: false, 
        message: 'Cập nhật role thất bại' 
      });
    }

    return res.json({
      success: true,
      message: `Cập nhật role thành "${role}" thành công`,
      data: { id, role }
    });

  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});


// API lấy thống kê quiz của một user
console.log("API statistics endpoint loaded!");

app.get('/api/admin/users/:id/statistics', async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin user
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('id, name, email, role, created_at')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Lấy tất cả quiz đã chơi của user này với thông tin quiz
    const { data: userQuizzes, error: quizzesError } = await supabase
      .from('user_quizzes')
      .select(`
        id,
        quiz_id,
        started_at,
        finished_at,
        result,
        created_at,
        quiz_type,
        quizzes (
          id,
          title,
          description,
          categories (
            name
          )
        )
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (quizzesError) {
      console.error('Lỗi khi lấy user_quizzes:', quizzesError);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy dữ liệu quiz'
      });
    }

    // Tính toán thống kê
    const totalQuizzes = userQuizzes.length;
    let totalTimeSpent = 0;
    let completedQuizzes = 0;
    const quizTypes = { iq: 0, personality: 0 };
    const recentQuizzes = userQuizzes.slice(0, 5); // 5 quiz gần nhất

    userQuizzes.forEach(quiz => {
      // Tính thời gian làm bài (nếu có started_at và finished_at)
      if (quiz.started_at && quiz.finished_at) {
        const startTime = new Date(quiz.started_at);
        const endTime = new Date(quiz.finished_at);
        const timeSpent = (endTime - startTime) / 1000 / 60; // phút
        if (timeSpent > 0 && timeSpent < 1440) { // Loại bỏ thời gian bất thường (>24h)
          totalTimeSpent += timeSpent;
        }
      }

      // Đếm quiz hoàn thành
      if (quiz.result) {
        completedQuizzes++;
      }

      // Đếm loại quiz
      if (quiz.quiz_type) {
        quizTypes[quiz.quiz_type] = (quizTypes[quiz.quiz_type] || 0) + 1;
      }
    });

    const avgTimePerQuiz = totalQuizzes > 0 ? Math.round(totalTimeSpent / totalQuizzes) : 0;

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          joinedAt: user.created_at
        },
        statistics: {
          totalQuizzes,
          completedQuizzes,
          totalTimeSpent: Math.round(totalTimeSpent),
          avgTimePerQuiz,
          quizTypes
        },
        recentQuizzes: recentQuizzes.map(quiz => ({
          id: quiz.id,
          quizId: quiz.quiz_id,
          quizTitle: quiz.quizzes?.title || 'Unknown Quiz',
          quizCategory: quiz.quizzes?.categories?.name || 'Unknown Category',
          startedAt: quiz.started_at,
          finishedAt: quiz.finished_at,
          result: quiz.result,
          quizType: quiz.quiz_type,
          timeSpent: quiz.started_at && quiz.finished_at 
            ? Math.round((new Date(quiz.finished_at) - new Date(quiz.started_at)) / 1000 / 60)
            : null,
          createdAt: quiz.created_at
        }))
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

// API lấy thông tin profile user
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User không tồn tại' });
    }

    // Lấy thống kê quiz
    const { data: quizStats } = await supabase
      .from('user_quizzes')
      .select('result')
      .eq('user_id', id);

    const totalQuizzes = quizStats?.length || 0;
    const completedQuizzes = quizStats?.filter(q => q.result).length || 0;

    return res.json({
      success: true,
      data: {
        ...user,
        totalQuizzes,
        completedQuizzes,
        avgScore: 0 // Tính sau nếu cần
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// API lấy quiz history của user
app.get('/api/users/:id/quizzes', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: userQuizzes, error } = await supabase
      .from('user_quizzes')
      .select(`
        *,
        quizzes (
          id,
          title,
          categories (name)
        )
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu' });
    }

    const formattedQuizzes = userQuizzes.map(uq => ({
      quiz_id: uq.quiz_id,
      quiz_title: uq.quizzes?.title || 'Unknown',
      quiz_category: uq.quizzes?.categories?.name || 'Unknown',
      quiz_type: uq.quiz_type,
      result: uq.result,
      created_at: uq.created_at
    }));

    return res.json({
      success: true,
      data: formattedQuizzes
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});



// API đổi mật khẩu user (đã fix bcrypt)
app.put('/api/users/:id/change-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    // Lấy thông tin user hiện tại
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('password_hash')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra mật khẩu hiện tại với bcrypt
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Hash mật khẩu mới với bcrypt
    const saltRounds = 12; // Giống với database hiện tại
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới đã hash
    const { error: updateError } = await supabase
      .from('user')
      .update({ password_hash: hashedNewPassword })
      .eq('id', id);

    if (updateError) {
      console.error('Lỗi cập nhật mật khẩu:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Cập nhật mật khẩu thất bại'
      });
    }

    return res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('Lỗi không mong muốn:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});



app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});