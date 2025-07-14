import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const options = [
  { text: 'Not at all', value: 0 },
  { text: 'Several days', value: 1 },
  { text: 'More than half the days', value: 2 },
  { text: 'Nearly every day', value: 3 },
];

const moodOptions = [
  { emoji: '😄', label: 'Happy', value: 'happy' },
  { emoji: '🙂', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
];

const MyTests = () => {
  const [gadQuestions, setGadQuestions] = useState([]);
  const [phqQuestions, setPhqQuestions] = useState([]);
  const [gadAnswers, setGadAnswers] = useState({});
  const [phqAnswers, setPhqAnswers] = useState({});
  const [gadScore, setGadScore] = useState(null);
  const [phqScore, setPhqScore] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/questions/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gad = res.data.filter((q) => q.type === 'GAD-7');
      const phq = res.data.filter((q) => q.type === 'PHQ-9');

      setGadQuestions(gad);
      setPhqQuestions(phq);
    };

    fetchQuestions();
  }, []);

  const handleGadChange = (qid, value) => {
    setGadAnswers({ ...gadAnswers, [qid]: value });
  };

  const handlePhqChange = (qid, value) => {
    setPhqAnswers({ ...phqAnswers, [qid]: value });
  };

  const submitGad = async () => {
  const unanswered = gadQuestions.some((q) => !(q.id in gadAnswers));
  if (unanswered) {
    alert('Please answer all GAD-7 questions before submitting.');
    return;
  }

  const token = localStorage.getItem('token');
  const payload = {
    answers: gadAnswers,
    total_score: Object.values(gadAnswers).reduce((a, b) => a + parseInt(b), 0),
    type: 'GAD-7',
  };

  try {
    const res = await axios.post('/api/assessment', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGadScore(payload.total_score);
  } catch (err) {
    console.error('Submission Error:', err);
    alert('Something went wrong while submitting your GAD-7 assessment.');
  }
};

  const submitPhq = async () => {
    const token = localStorage.getItem('token');
    const payload = {
  answers: phqAnswers,
  total_score: Object.values(phqAnswers).reduce((a, b) => a + parseInt(b), 0),
  type: 'PHQ-9' 
};
    const res = await axios.post('/api/assessment', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPhqScore(payload.total_score);
  };

  const submitMood = async () => {
    if (!selectedMood) return;
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/mood',
      { mood: selectedMood },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMoodSubmitted(true);
  };

  return (
    <div className="test-section">
      <h2 className="test-title">GAD-7 Assessment</h2>
      {gadQuestions.map((q) => (
        <div key={q.id} className="question-block">
          <p>{q.text}</p>
          <div className="option-group">
            {options.map((opt, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  name={`gad-${q.id}`}
                  value={opt.value}
                  onChange={() => handleGadChange(q.id, opt.value)}
                />
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="submit-btn" onClick={submitGad}>Submit GAD-7</button>
      {gadScore !== null && (
        <div className="score-box">Your GAD-7 Score: {gadScore}</div>
      )}

      <hr className="test-divider" />

      <h2 className="test-title">PHQ-9 Assessment</h2>
      {phqQuestions.map((q) => (
        <div key={q.id} className="question-block">
          <p>{q.text}</p>
          <div className="option-group">
            {options.map((opt, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  name={`phq-${q.id}`}
                  value={opt.value}
                  onChange={() => handlePhqChange(q.id, opt.value)}
                />
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="submit-btn" onClick={submitPhq}>Submit PHQ-9</button>
      {phqScore !== null && (
        <div className="score-box">Your PHQ-9 Score: {phqScore}</div>
      )}

      <hr className="test-divider" />

     <h2 className="test-title">Submit Your Mood</h2>
<div className="mood-emoji-grid">
  {moodOptions.map((mood, idx) => (
    <button
      key={idx}
      className={`emoji-button ${selectedMood === mood.value ? 'selected' : ''}`}
      onClick={() => setSelectedMood(mood.value)}
    >
      {mood.emoji}
    </button>
  ))}
</div>
<button
  className="submit-btn"
  onClick={submitMood}
  disabled={moodSubmitted || !selectedMood}
>
  {moodSubmitted ? 'Mood Submitted ✅' : 'Submit Mood'}
</button>
    </div>
  );
};

export default MyTests;
