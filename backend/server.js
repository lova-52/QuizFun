import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Kết nối Supabase
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
      
      // Nếu có question_image, tạo public URL
      if (question.question_image) {
        const { data } = supabase.storage
          .from('project-bucket')
          .getPublicUrl(question.question_image);
        questionImageUrl = data.publicUrl;
      }

      return {
        id: question.id,
        question: question.content,
        questionImage: questionImageUrl, // Thêm URL ảnh câu hỏi
        type: question.type, // 'single_choice' hoặc 'multi_choice'
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
    const { answers, timeSpent, userId } = req.body;

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
      .select('quiz_type')
      .eq('id', id)
      .single();

    if (quizError || !quiz) {
      return res.status(500).json({ 
        success: false, 
        message: 'Không tìm thấy quiz' 
      });
    }

    // Lấy tất cả câu hỏi của quiz, sắp xếp theo order
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, answers (id, is_correct, is_personality)')
      .eq('quiz_id', id);

    if (questionsError) {
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy câu hỏi và đáp án' 
      });
    }

    let score = 0;
    const totalQuestions = questions.length;
    let personalityCounts = {};

    // Xử lý tính điểm
    answers.forEach(userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (!question) return;

      const correctAnswerIds = question.answers
        .filter(a => a.is_correct)
        .map(a => a.id);

      const userAnswerIds = Array.isArray(userAnswer.selectedAnswers) 
        ? userAnswer.selectedAnswers 
        : [userAnswer.selectedAnswers];

      // Kiểm tra đáp án đúng cho loại quiz IQ
      if (quiz.quiz_type === 'iq') {
        const isCorrect = correctAnswerIds.length === userAnswerIds.length &&
          correctAnswerIds.every(id => userAnswerIds.includes(id));

        if (isCorrect) {
          score++;
        }
      }

      // Kiểm tra loại quiz Personality
      if (quiz.quiz_type === 'personality') {
        question.answers.forEach(answer => {
          if (userAnswer.selectedAnswers.includes(answer.id)) {
            const personality = answer.is_personality;
            if (personality) {
              personalityCounts[personality] = (personalityCounts[personality] || 0) + 1;
            }
          }
        });
      }
    });

    // Tính kết quả cho quiz personality
    let personalityType = 'balanced';
    let maxCount = 0;
    for (const [key, value] of Object.entries(personalityCounts)) {
      if (value > maxCount) {
        personalityType = key;
        maxCount = value;
      }
    }

    // Tính điểm và trả kết quả
    score = Math.round((score / totalQuestions) * 100);

    // Lấy play_count hiện tại
    const { data: quizPlayData, error: playCountError } = await supabase
      .from('quizzes')
      .select('play_count')
      .eq('id', id)
      .single();

    if (playCountError) {
      console.error('Lỗi khi lấy play_count:', playCountError);
      return res.status(500).json({ success: false, message: 'Không thể lấy số lượt chơi hiện tại' });
    }

    // Cập nhật play_count
    const { error: updateError } = await supabase
      .from('quizzes')
      .update({ play_count: (quizPlayData.play_count || 0) + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('Lỗi khi cập nhật play_count:', updateError);
      return res.status(500).json({ success: false, message: 'Không thể cập nhật số lượt chơi' });
    }



    // Ghi lại lịch sử làm quiz vào bảng user_quizzes
    const { error: userQuizInsertError } = await supabase
      .from('user_quizzes')
      .insert([{
        user_id: userId,
        quiz_id: id,
        quiz_type: quiz.quiz_type,
        started_at: new Date().toISOString(), // Ghi thời gian bắt đầu (hoặc có thể lấy từ frontend)
        finished_at: new Date().toISOString(), // Ghi thời gian kết thúc (hoặc lấy từ frontend)
        result: JSON.stringify({ score, personalityType}) // Kết quả quiz
      }]);

    if (userQuizInsertError) {
      console.error('Lỗi khi ghi lịch sử làm quiz:', userQuizInsertError);
      // Không cần trả lỗi response ở đây, vì không ảnh hưởng đến trải nghiệm người dùng
    }

    // Trả kết quả
    return res.json({
      success: true,
      data: {
        score,
        totalQuestions,
        timeSpent,
        personalityType,
        passed: score >= 60,
        quizType: quiz.quiz_type
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

// API tạo quiz mới
app.post('/api/admin/quizzes', async (req, res) => {
  try {
    const { title, description, categoryId, timeLimit, quizType, questions } = req.body;

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
        total_questions: questions.length
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
          order: i + 1
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


app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});