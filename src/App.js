import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const API_URL = 'http://tasktracker-api-robricola95.eastus.azurecontainer.io:5116';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL + '/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const response = await fetch(API_URL + '/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 0, title, completed: false })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(API_URL + '/api/tasks/' + id, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const catMessages = [
    'Purr-fect productivity!',
    'No tasks? Cat nap time!',
    'Meow-velous work ethic!',
    'You are feline productive!',
    'Paws and get organized!'
  ];

  const randomCat = catMessages[Math.floor(Math.random() * catMessages.length)];

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #1a1a4e, #24243e)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>😺</div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#e8e6f0',
            margin: '0 0 4px 0',
            letterSpacing: '-0.5px'
          }}>
            Cat Task Tracker
          </h1>
          <p style={{ fontSize: '14px', color: '#7B68EE', margin: 0 }}>
            {randomCat}
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',