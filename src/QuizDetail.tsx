import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Answer {
  id: number;
  answer: string;
  answer_type: string; 
}

interface Question{
  id: number;
  questions: string;
  answers: Answer[];
}

const QuizDetail:React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [error, setError] = useState<string |null>(null);
  const [loading, setLoading] = useState(true);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/quizzes/${quizId}/`,{
        headers:{
            Authorization:`Basic ${btoa('simran:nensi123')}`
        }
    })
    .then((response) => {
      if (response.data && response.data.questions) {
        setQuestions(response.data.questions); // Set questions if available
      } else {
        setError("No questions found for this quiz.");
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching quiz data", error);
      setError("Error fetching quiz data.");
      setLoading(false);
    });
  }, [quizId]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prevState:any) => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const handleMultipleAnswersSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prevState: any) => {
      const currentAnswers = prevState[questionId] || []; // Default to an empty array if no answers yet
      const updatedAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter((id: number) => id !== answerId) // Remove the answer if it's already selected
        : [...currentAnswers, answerId]; // Add the answer if it's not selected yet
  
      return {
        ...prevState,
        [questionId]: updatedAnswers, // Store the selected answers as an array
      };
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  const handlePrevious = () => {
    if(currentQuestionIndex > 0){
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  // Submit the quiz
  const handleSubmit = () => {
    const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerIds]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      const isMultipleAnswer = question?.answers.some(answer => answer.answer_type === 'multiple');
  
      // Format the answer data based on the type of question
      const formattedAnswer = isMultipleAnswer
        ? Array.isArray(answerIds) // For multiple answers, ensure it's an array
          ? answerIds
          : [answerIds] // Convert to array if it's a single answer
        : answerIds; // For single answer, just pass the single answer id
  
      return {
        question: parseInt(questionId),
        answer: formattedAnswer,
      };
    });
    console.log(formattedAnswers);
    if(formattedAnswers.length === questions.length){
      axios
      .post(
        `http://127.0.0.1:8000/quizzes/${quizId}/submit/`,
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Basic ${btoa("simran:nensi123")}`,
          },
        }
      )
      .then((response) => {
        setQuizSubmitted(true);
        setUserStats(response.data);
        toast.success('Quiz submitted successfully!', { position: 'top-right' });
        console.log(userStats);
        setTimeout(()=>{
          navigate('/');
        },5000);
        console.log(response.data); // Handle success response (e.g., score, message, etc.)
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
        toast.error('Error submitting quiz.', { position: 'top-right' });
      });
    }
    else {
      toast.error('Please answer all questions before submitting.', { position: 'top-right' });
    }
  };

  if (error) return <div>Error: {error}</div>;
  
  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading quiz, please wait...</p>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  // Check if all questions are answered to enable submit
  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="quiz-detail">
      <ToastContainer />
      <div className="question-card">
          <h2>{currentQuestion.questions}</h2>
          <div className="answer-options">
          {currentQuestion.answers.map((answer) => (
            <div key={answer.id}>
              <label>
                {answer.answer_type === 'multiple' ? (
                  <input
                    type="checkbox"
                    name={`question-${currentQuestion.id}`}
                    value={answer.id}
                    checked={selectedAnswers[currentQuestion.id]?.includes(answer.id)}
                    onChange={() => handleMultipleAnswersSelect(currentQuestion.id, answer.id)}
                  />
                ) : (
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={answer.id}
                    checked={selectedAnswers[currentQuestion.id] === answer.id}
                    onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                  />
                )}
                {answer.answer}
              </label>
            </div>
          ))}
        </div>
        {currentQuestion.answers.some((answer) => answer.answer_type === 'multiple') && (
          <div className="tick-all">Tick all that apply</div>
        )}
          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
              Next
            </button>
          </div>
        </div>
        {!quizSubmitted && (
        <div className="submit-section">
          <button onClick={handleSubmit} disabled={!allQuestionsAnswered}>
            Submit Quiz
          </button>
        </div>
      )}
      {quizSubmitted && userStats && (
        <div className="user-stats">
          <h3>Your Results:</h3>
          <p><strong>Score:</strong> {userStats.score}</p>
          <p><strong>Completed in:</strong> {userStats.timeTaken} seconds</p>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
