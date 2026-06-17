import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const FILTERS = ['All', 'Active', 'Done'];

let nextId = 4;

const defaultTasks = [
  { id: 1, text: 'Set up the project locally', done: true },
  { id: 2, text: 'Write the Dockerfile', done: false },
  { id: 3, text: 'Deploy to EC2', done: false },
];

export default function App() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTasks(prev => [...prev, { id: nextId++, text, done: false }]);
    setInput('');
  };

  const toggle = (id) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const remove = (id) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const clearDone = () =>
    setTasks(prev => prev.filter(t => !t.done));

  const visible = tasks.filter(t => {
    if (filter === 'Active') return !t.done;
    if (filter === 'Done') return t.done;
    return true;
  });

  const doneCount = tasks.filter(t => t.done).length;
  const totalCount = tasks.length;

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <h1 className="title">Tasks</h1>
          <span className="counter">{doneCount}/{totalCount}</span>
        </header>

        {/* Progress bar */}
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: totalCount ? `${(doneCount / totalCount) * 100}%` : '0%' }}
          />
        </div>

        {/* Input */}
        <div className="input-row">
          <input
            ref={inputRef}
            className="task-input"
            type="text"
            placeholder="Add a task…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button className="add-btn" onClick={add} aria-label="Add task">
            +
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        <ul className="task-list">
          {visible.length === 0 && (
            <li className="empty">
              {filter === 'Done' ? 'Nothing completed yet.' : 'All clear!'}
            </li>
          )}
          {visible.map(task => (
            <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <button
                className="checkbox"
                onClick={() => toggle(task.id)}
                aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.done && (
                  <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className="task-text">{task.text}</span>
              <button
                className="delete-btn"
                onClick={() => remove(task.id)}
                aria-label="Delete task"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        {doneCount > 0 && (
          <footer className="footer">
            <button className="clear-btn" onClick={clearDone}>
              Clear completed ({doneCount})
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
