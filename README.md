# Quiz App

This project is a Quiz application built with React and TypeScript.

## Project Structure
.gitignore package.json public/ index.html manifest.json robots.txt README.md src/ App.css App.test.tsx App.tsx index.css index.tsx QuizDetail.tsx QuizList.tsx react-app-env.d.ts reportWebVitals.ts setupTests.ts UserStat.tsx tsconfig.json

## Components

### `App`

The main component that sets up the router and routes for the application. It uses `react-router-dom` to define routes for the quiz list and quiz details.

```tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import QuizDetail from './QuizDetail';
import QuizList from './QuizList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/quiz/:quizId" element={<QuizDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

QuizList
A component that displays a list of quizzes.

QuizDetail
A component that displays the details of a specific quiz.
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserStats = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/user-statistics/')
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Statistics</h1>
      <ul>
        {stats.map((stat:any) => (
          <li key={stat.id}>
            Quiz: {stat.quiz.title}, Score: {stat.score}, Date: {stat.date_taken}
          </li>
        ))}
      </ul>
    </div>
  );
};


