'use client';

import { useState } from 'react';

export default function Home() {
  const [grade, setGrade] = useState('4th');
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [type, setType] = useState('Worksheet');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!topic.trim()) {
      setError('Пожалуйста, введите тему');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, subject, topic, numQuestions, type }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Что-то пошло не так');

      setResult(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>📝 TeachSheet AI</h1>
        <p>Worksheet & Quiz Generator для учителей</p>
        <p><strong>Common Core & State Standards Aligned</strong></p>
      </header>

      <div className="form">
        <label>Grade Level</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          {['Kindergarten','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'].map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <label>Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="Math">Math</option>
          <option value="English Language Arts">English Language Arts (ELA)</option>
          <option value="Science">Science</option>
          <option value="Social Studies">Social Studies</option>
        </select>

        <label>Topic</label>
        <input 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="Например: Fractions, Photosynthesis, American Revolution" 
        />

        <label>Number of Questions</label>
        <input 
          type="number" 
          value={numQuestions} 
          onChange={(e) => setNumQuestions(Number(e.target.value))} 
          min="5" 
          max="20" 
        />

        <label>Что генерировать?</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Worksheet">Worksheet</option>
          <option value="Quiz">Quiz</option>
          <option value="Both">Both (Worksheet + Quiz)</option>
        </select>

        <button onClick={generate} disabled={loading}>
          {loading ? 'Генерируем... (10–25 секунд)' : '🚀 Generate Materials'}
        </button>

        {error && <p style={{color: 'red', marginTop: '15px'}}>{error}</p>}
      </div>

      {result && (
        <div className="result">
          <h2>✅ Готово!</h2>
          <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br><br>') }} />
          <button 
            onClick={() => navigator.clipboard.writeText(result)} 
            style={{marginTop: '20px', padding: '12px 20px'}}
          >
            📋 Скопировать текст
          </button>
        </div>
      )}
    </div>
  );
}
