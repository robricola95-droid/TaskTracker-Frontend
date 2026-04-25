import React, { useState, useEffect } from 'react';


function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const API_URL = 'http://tasktracker-api-robricola95.eastus.azurecontainer.io:5116';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
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
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Task Tracker</h1>
          <p className="text-gray-600 text-lg">Stay organized and productive</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map(task => (
                <li
                  key={task.id}
                  className="p-4 hover:bg-gray-50 transition duration-150 flex items-center justify-between"
                >
                  <span className="text-gray-800">{task.title}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Task Count */}
        {tasks.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">You have <span className="font-semibold">{tasks.length}</span> task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;