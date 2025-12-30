import './DiaryEntries.css';

function DiaryEntries({ entries, onDeleteEntry }) {
  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    excited: '🤩',
    anxious: '😰',
    calm: '😌'
  };

  if (entries.length === 0) {
    return (
      <div className="no-entries">
        <p>No entries yet. Start writing your first diary entry!</p>
      </div>
    );
  }

  return (
    <div className="diary-entries">
      <h2>Your Entries</h2>
      <div className="entries-list">
        {entries.map(entry => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <div className="entry-date-mood">
                <span className="entry-date">{entry.date}</span>
                <span className="entry-mood">{moodEmojis[entry.mood]}</span>
              </div>
              <button
                className="delete-btn"
                onClick={() => onDeleteEntry(entry.id)}
                title="Delete entry"
              >
                ✕
              </button>
            </div>
            <p className="entry-content">{entry.content}</p>
            <p className="entry-time">Added: {entry.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryEntries;
