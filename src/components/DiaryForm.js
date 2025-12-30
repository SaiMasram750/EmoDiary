import { useState } from 'react';
import './DiaryForm.css';

function DiaryForm({ onAddEntry }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('neutral');
  const [content, setContent] = useState('');

  const moods = ['happy', 'sad', 'neutral', 'excited', 'anxious', 'calm'];
  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    excited: '🤩',
    anxious: '😰',
    calm: '😌'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please write something in your diary!');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date,
      mood,
      content,
      createdAt: new Date().toLocaleString()
    };

    onAddEntry(newEntry);
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setMood('neutral');
  };

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <h2>New Entry</h2>
      
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="mood">How are you feeling?</label>
        <div className="mood-selector">
          {moods.map(m => (
            <button
              key={m}
              type="button"
              className={`mood-btn ${mood === m ? 'active' : ''}`}
              onClick={() => setMood(m)}
              title={m}
            >
              {moodEmojis[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="content">What's on your mind?</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts, feelings, and experiences here..."
          rows="6"
          required
        />
      </div>

      <button type="submit" className="submit-btn">Save Entry</button>
    </form>
  );
}

export default DiaryForm;
