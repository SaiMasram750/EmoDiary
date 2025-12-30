import { useState, useEffect } from 'react';
import './App.css';
import DiaryForm from './components/DiaryForm';
import DiaryEntries from './components/DiaryEntries';
import CbtExercise from "./components/CbtExercise";
import BurnoutCalculator from "./components/BurnoutCalculator"; 
import BurnoutDashboard from "./components/BurnoutDashboard";

function App() {
  const [entries, setEntries] = useState([]);
  const [scores, setScores] = useState([]);
  const [activeTab, setActiveTab] = useState('diary');

  const handleResult = (score) => { setScores([...scores, score]); };

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (newEntry) => {
    setEntries([newEntry, ...entries]);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📔 EmoDiary</h1>
        <p>Track your emotions and mental wellness</p>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'diary' ? 'active' : ''}`}
          onClick={() => setActiveTab('diary')}
        >
          📝 Diary
        </button>
        <button 
          className={`nav-btn ${activeTab === 'cbt' ? 'active' : ''}`}
          onClick={() => setActiveTab('cbt')}
        >
          🧠 CBT Exercises
        </button>
        <button 
          className={`nav-btn ${activeTab === 'burnout' ? 'active' : ''}`}
          onClick={() => setActiveTab('burnout')}
        >
          📊 Burnout Check
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'diary' && (
          <div className="tab-content">
            <DiaryForm onAddEntry={addEntry} />
            <DiaryEntries entries={entries} onDeleteEntry={deleteEntry} />
          </div>
        )}

        {activeTab === 'cbt' && (
          <div className="tab-content">
            <CbtExercise />
          </div>
        )}

        {activeTab === 'burnout' && (
          <div className="tab-content">
            <BurnoutCalculator onResult={handleResult} />
            <BurnoutDashboard scoreHistory={scores} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
