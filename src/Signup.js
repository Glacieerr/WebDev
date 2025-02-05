import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/signup', {
        firstName,
        lastName,
        username,
        password
      });
      alert('User signed up successfully');
      // Clear form fields
      setFirstName('');
      setLastName('');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Failed to signup user');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <label>First Name:</label>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      <br />
      <label>Last Name:</label>
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      <br />
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
