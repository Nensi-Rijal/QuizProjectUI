import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Answer {
  id: number;
  answer: string;
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
    const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
      question: parseInt(questionId),
      answer: answerId,
    }))
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
      {!quizSubmitted ? (
        <div className="question-card">
          <h2>{currentQuestion.questions}</h2>
          <div className="answer-options">
            {currentQuestion.answers && currentQuestion.answers.length > 0 ? (
              currentQuestion.answers.map((answer) => (
                <div key={answer.id}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={answer.id}
                      checked={selectedAnswers[currentQuestion.id] === answer.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                    />
                    {answer.answer}
                  </label>
                </div>
              ))
            ) : (
              <div>No answers available for this question.</div>
            )}
          </div>

          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
              Next
            </button>
          </div>

          <div className="submit-section">
            <button onClick={handleSubmit} disabled={!allQuestionsAnswered}>
              Submit Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="user-stats">
          <h3>Congratulations! You have successfully completed the quiz.</h3>
          <p>
            <strong>Score:</strong> {userStats?.score}
          </p>
          <p>
            <strong>Time Taken:</strong> {userStats?.timeTaken} seconds
          </p>
          <button onClick={() => navigate('/')}>Go Back to Quiz List</button>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
