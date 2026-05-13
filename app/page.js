'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';

export default function Home() {
  const [grade, setGrade] = useState('4th');
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [type, setType] = useState('Worksheet');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  const examples = [
    "Fractions and Decimals",
    "Photosynthesis",
    "American Revolution",
    "Multiplication Tables",
    "States of Matter",
    "Writing a Persuasive Essay"
  ];

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
      if (!res.ok) throw new Error(data.error || 'Ошибка');

      setResult(data.text);
      setTitle(`${grade} ${subject} - ${topic}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text(title || "TeachSheet AI", 20, 20);
    
    const lines = doc.splitTextToSize(result, 170);
    doc.setFontSize(12);
    doc.text(lines, 20, 40);
    
    doc.save(`${title.replace(/ /g, '_') || 'teachsheet'}.pdf`);
  };

  const useExample = (example) => {
    setTopic(example);
  };

  return (
    <div className="container">
      <header>
        <h1>📝 TeachSheet AI</h1>
        <p>Быстрый генератор рабочих листов и тестов для учителей</p>
        <p><strong>Common Core • State Standards Aligned</strong></p>
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
          placeholder="Например: Fractions..." 
        />

        <div style={{margin: '10px 0'}}>
          <small>Примеры тем:</small><br/>
          {examples.map((ex, i) => (
            <button key={i} onClick={() => useExample(ex)} style={{margin: '4px 4px 4px 0', padding: '6px 12px', fontSize: '13px'}}>
              {ex}
            </button>
          ))}
        </div>

        <label>Number of Questions</label>
        <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} min="5" max="20" />

        <label>Что генерировать?</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Worksheet">Worksheet</option>
          <option value="Quiz">Quiz</option>
          <option value="Both">Both</option>
        </select>

        <button onClick={generate} disabled={loading} style={{marginTop: '25px'}}>
          {loading ? 'Генерируем материал...' : '🚀 Generate Materials'}
        </button>

        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>

      {result && (
        <div className="result">
          <h2>✅ Готово!</h2>
          <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br><br>') }} />

          <div style={{marginTop: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
            <button onClick={downloadPDF} style={{background: '#10b981', flex: '1'}}>
              📄 Скачать как PDF
            </button>
            <button onClick={() => navigator.clipboard.writeText(result)} style={{flex: '1'}}>
              📋 Скопировать текст
            </button>
          </div>
        </div>
      )}

      <footer style={{textAlign: 'center', padding: '40px 20px', color: '#666', fontSize: '14px'}}>
        TeachSheet AI — сделано для учителей • Работает на Groq
      </footer>
    </div>
  );
}
