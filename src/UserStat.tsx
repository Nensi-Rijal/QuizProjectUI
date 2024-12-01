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

export default UserStats;
