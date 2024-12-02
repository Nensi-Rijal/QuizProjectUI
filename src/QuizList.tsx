import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Card = ({ item }:any) => {
  const navigate = useNavigate();
  return (
    <div className="card"
    onClick={() => navigate(`/quiz/${item.id}`)} // Navigate using item.id
      style={{ cursor: "pointer" }}
>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
};

const QuizList: React.FC = () => {
    const [quizzes, setQuizzes] = useState<any>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState<boolean>(true); // New loading state

    useEffect(() => {
        axios.get('https://quiz-project-api.vercel.app/quizzes/',{
            headers:{
                Authorization:`Basic ${btoa('simran:nensi123')}`
            }
        })
          .then((response) => {
            setQuizzes(response.data);
            setLoading(false); 
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false); 
          });
      }, []);

      if (loading)
        return (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading quizzes, please wait...</p>
          </div>
        );
        
      if (error) return <div>Error: {error}</div>;

    return(
      <div className="quiz-list-container">
      <h1>Quiz Lists</h1> {/* Heading above cards */}
      <div className="card-container">
        {quizzes.map((item: any) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
    );
}

export default QuizList