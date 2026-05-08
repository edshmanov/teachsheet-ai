import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { grade, subject, topic, numQuestions, type } = await request.json();

    const prompt = `Ты — эксперт-учитель K-12 в США. Создай качественный, интересный и соответствующий стандартам материал.

Grade: ${grade}
Subject: ${subject}
Topic: ${topic}
Number of questions: ${numQuestions}
Type: ${type}

Сделай материал готовым к печати.
Используй понятный язык.
В конце обязательно добавь Answer Key (ключ с ответами).
Форматируй через markdown.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Ошибка Groq API');
    }

    const text = data.choices[0].message.content;

    return NextResponse.json({ text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: error.message || 'Что-то пошло не так' 
    }, { status: 500 });
  }
}
