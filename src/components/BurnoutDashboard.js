import "./BurnoutDashboard.css";

function BurnoutDashboard({ scoreHistory }) {
  if (scoreHistory.length === 0) {
    return (
      <div className="burnout-dashboard">
        <h2>Burnout Dashboard</h2>
        <p>No scores yet. Take the burnout calculator to see your results.</p>
      </div>
    );
  }

  const avgScore = Math.round(scoreHistory.reduce((a, b) => a + b, 0) / scoreHistory.length);
  const maxScore = Math.max(...scoreHistory);
  const minScore = Math.min(...scoreHistory);

  return (
    <div className="burnout-dashboard">
      <h2>Burnout Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">{avgScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Highest Score</h3>
          <p className="stat-value">{maxScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Lowest Score</h3>
          <p className="stat-value">{minScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Total Tests</h3>
          <p className="stat-value">{scoreHistory.length}</p>
        </div>
      </div>

      <div className="scores-history">
        <h3>Score History</h3>
        <div className="score-list">
          {scoreHistory.map((score, i) => (
            <div key={i} className="score-item">
              <span>Test {i + 1}</span>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${score}%` }}>
                  {score}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BurnoutDashboard;
