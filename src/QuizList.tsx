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

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/quizzes/',{
            headers:{
                Authorization:`Basic ${btoa('simran:nensi123')}`
            }
        })
          .then((response) => {
            setQuizzes(response.data);
          })
          .catch((error) => {
            setError(error.message);
          });
      }, []);

      if (error) return <div>Error: {error}</div>;

    return(
    <div className="card-container">
    {quizzes.map((item:any) => (
      <Card key={item.id} item={item} />
    ))}
  </div>
    );
}

export default QuizList