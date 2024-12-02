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
