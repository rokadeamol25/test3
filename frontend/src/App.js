import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch students
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add student
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/students', { name, email })
      .then(res => {
        setStudents([...students, res.data]);
        setName('');
        setEmail('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <h1>Students</h1>
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
        {students.map(student => (
          <li key={student.id}>{student.name} - {student.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;