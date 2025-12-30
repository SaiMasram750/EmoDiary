import { useState } from "react";

function BurnoutCalculator({ onResult }) {
  const [answers, setAnswers] = useState({ q1: 0, q2: 0, q3: 0 });

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: Number(e.target.value) });
  };

  const calculateScore = () => {
    const total = answers.q1 + answers.q2 + answers.q3;
    const max = 15; // 3 questions * max 5
    const score = Math.round((total / max) * 100);
    onResult(score);
  };

  return (
    <div className="burnout-calculator">
      <h2>Burnout Calculator</h2>

      <label>How often do you feel exhausted?</label>
      <input type="number" name="q1" min="1" max="5" onChange={handleChange} />

      <label>How often do you feel detached from work/study?</label>
      <input type="number" name="q2" min="1" max="5" onChange={handleChange} />

      <label>How satisfied are you with your rest/sleep?</label>
      <input type="number" name="q3" min="1" max="5" onChange={handleChange} />

      <button onClick={calculateScore}>Calculate Burnout</button>
    </div>
  );
}

export default BurnoutCalculator;
