import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import QuizDetail from './QuizDetail';
import QuizList from './QuizList';
import UserStats from './UserStat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/quiz/:quizId" element={<QuizDetail />} />
        <Route path="/user-stats" element={<UserStats />} />
      </Routes>
    </Router>
  );
}

export default App;
