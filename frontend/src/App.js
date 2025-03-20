import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = () => {
    axios.get('/api/students')
      .then(res => {
        console.log('Fetched:', res.data);
        setStudents(res.data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load students');
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    axios.post('/api/students', { name, email })
      .then(res => {
        console.log('Added:', res.data);
        setName('');
        setEmail('');
        fetchStudents(); // Refetch to ensure sync
      })
      .catch(err => {
        console.error('Post error:', err);
        setError(err.response?.data?.error || 'Failed to add student');
      });
  };

  return (
    <div className="App">
      <h1>Students</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add Student</button>
      </form>
      <ul>
        {students.length > 0 ? (
          students.map(student => (
            <li key={student.id}>{student.name} - {student.email}</li>
          ))
        ) : (
          <p>No students yet</p>
        )}
      </ul>
    </div>   
  );
}

export default App;