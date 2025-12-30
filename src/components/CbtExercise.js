import { useState } from "react";
import "./CbtExercise.css";

const cbtExercisesByMood = {
  happy: {
    title: "Celebrate Positivity",
    prompts: [
      "What made you feel happy today?",
      "How can you repeat this experience in the future?",
      "Who can you share this joy with?"
    ]
  },
  sad: {
    title: "Reframing Sadness",
    prompts: [
      "What triggered your sadness?",
      "What evidence challenges the negative thoughts you had?",
      "What small action could lift your mood right now?"
    ]
  },
  neutral: {
    title: "Mindful Reflection",
    prompts: [
      "What went well today, even if small?",
      "What could you improve tomorrow?",
      "How do you feel about your current balance in life?"
    ]
  },
  excited: {
    title: "Harness Excitement",
    prompts: [
      "What are you most excited about?",
      "How can you channel this energy productively?",
      "What steps will help you sustain this excitement?"
    ]
  },
  anxious: {
    title: "Challenge Anxious Thoughts",
    prompts: [
      "What specific worry is on your mind?",
      "What evidence supports this worry? What evidence goes against it?",
      "What's a more balanced way to view this situation?"
    ]
  },
  calm: {
    title: "Strengthen Calmness",
    prompts: [
      "What helped you feel calm today?",
      "How can you bring this calmness into stressful moments?",
      "What routine or habit supports your peace of mind?"
    ]
  }
};

function CbtExercise() {
  const [selectedMood, setSelectedMood] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [currentResponse, setCurrentResponse] = useState("");
  const [exerciseType, setExerciseType] = useState("standard"); // "standard" or "ai"
  const [aiExercise, setAiExercise] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

  const moods = [
    { value: "happy", emoji: "😊", label: "Happy" },
    { value: "sad", emoji: "😢", label: "Sad" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "excited", emoji: "🤩", label: "Excited" },
    { value: "anxious", emoji: "😰", label: "Anxious" },
    { value: "calm", emoji: "😌", label: "Calm" }
  ];

  const selectMood = (mood) => {
    setSelectedMood(mood);
    setCurrentPromptIndex(0);
    setResponses({});
    setCurrentResponse("");
    setExerciseType("standard");
    setAiExercise(null);
  };

  const generateAiExercise = async (mood) => {
    if (!API_KEY) {
      alert("AI API key not configured. Using standard exercise.");
      return;
    }

    setLoadingAi(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "EmoDiary"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `You are a CBT (Cognitive Behavioral Therapy) coach. Create a personalized CBT exercise for someone feeling ${mood}.

Generate 3 unique reflection prompts that are specific and actionable. Format your response as JSON with this structure:
{
  "title": "Exercise title",
  "prompts": ["prompt 1", "prompt 2", "prompt 3"]
}

Make the prompts thoughtful, specific to the mood, and designed to help reframe thoughts or build resilience.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const content = data.choices[0].message.content;
        try {
          const exercise = JSON.parse(content);
          setAiExercise(exercise);
          setExerciseType("ai");
          setCurrentPromptIndex(0);
          setResponses({});
          setCurrentResponse("");
        } catch (e) {
          alert("Error parsing AI response. Using standard exercise.");
          setExerciseType("standard");
        }
      }
    } catch (error) {
      console.error("AI API Error:", error);
      alert("Error generating AI exercise. Using standard exercise.");
      setExerciseType("standard");
    }
    setLoadingAi(false);
  };

  const handleResponseChange = (e) => {
    setCurrentResponse(e.target.value);
  };

  const saveResponse = () => {
    if (!currentResponse.trim()) {
      alert("Please write a response before moving to the next prompt.");
      return;
    }

    const exercise = exerciseType === "ai" ? aiExercise : cbtExercisesByMood[selectedMood];
    const newResponses = {
      ...responses,
      [currentPromptIndex]: currentResponse
    };
    setResponses(newResponses);

    if (currentPromptIndex < exercise.prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      setCurrentResponse(newResponses[currentPromptIndex + 1] || "");
    }
  };

  const goToPreviousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
      setCurrentResponse(responses[currentPromptIndex - 1] || "");
    }
  };

  const completeExercise = () => {
    if (!currentResponse.trim()) {
      alert("Please write a response for the final prompt.");
      return;
    }

    const finalResponses = {
      ...responses,
      [currentPromptIndex]: currentResponse
    };
    setResponses(finalResponses);
    alert("Great job completing this exercise! Your reflections have been saved.");
    setSelectedMood("");
    setCurrentPromptIndex(0);
    setResponses({});
    setCurrentResponse("");
    setExerciseType("standard");
    setAiExercise(null);
  };

  const resetExercise = () => {
    setSelectedMood("");
    setCurrentPromptIndex(0);
    setResponses({});
    setCurrentResponse("");
    setExerciseType("standard");
    setAiExercise(null);
  };

  if (!selectedMood) {
    return (
      <div className="cbt-exercise">
        <h2>🧠 CBT Exercises</h2>
        <p className="subtitle">Interactive exercises to help manage your emotions</p>

        <div className="mood-selector">
          <p>How are you feeling right now?</p>
          <div className="mood-buttons">
            {moods.map((mood) => (
              <button
                key={mood.value}
                className="mood-btn"
                onClick={() => selectMood(mood.value)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const exercise = exerciseType === "ai" ? aiExercise : cbtExercisesByMood[selectedMood];
  const totalPrompts = exercise.prompts.length;
  const isLastPrompt = currentPromptIndex === totalPrompts - 1;
  const progress = ((currentPromptIndex + 1) / totalPrompts) * 100;

  return (
    <div className="cbt-exercise">
      <div className="exercise-header">
        <div className="header-top">
          <h2>{exercise.title}</h2>
          {exerciseType === "ai" && <span className="ai-badge">✨ AI Generated</span>}
        </div>
        <p className="progress-text">
          Question {currentPromptIndex + 1} of {totalPrompts}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="exercise-content">
        <div className="prompt-section">
          <h3>Reflection Prompt</h3>
          <p className="prompt-text">{exercise.prompts[currentPromptIndex]}</p>
        </div>

        <div className="response-section">
          <label htmlFor="response">Your Response:</label>
          <textarea
            id="response"
            value={currentResponse}
            onChange={handleResponseChange}
            placeholder="Write your thoughts and reflections here..."
            rows="6"
          />
        </div>

        <div className="button-group">
          {currentPromptIndex > 0 && (
            <button className="prev-btn" onClick={goToPreviousPrompt}>
              ← Previous
            </button>
          )}

          {!isLastPrompt ? (
            <button
              className="next-btn"
              onClick={saveResponse}
              disabled={!currentResponse.trim()}
            >
              Next →
            </button>
          ) : (
            <button
              className="complete-btn"
              onClick={completeExercise}
              disabled={!currentResponse.trim()}
            >
              Complete Exercise ✓
            </button>
          )}
        </div>

        <div className="exercise-options">
          {exerciseType === "standard" && (
            <button
              className="ai-option-btn"
              onClick={() => generateAiExercise(selectedMood)}
              disabled={loadingAi}
            >
              {loadingAi ? "Generating AI Exercise..." : "✨ Get AI-Personalized Exercise"}
            </button>
          )}
          <button className="reset-btn" onClick={resetExercise}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

export default CbtExercise;
