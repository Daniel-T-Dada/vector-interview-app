'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function QuestionDisplay({ question, questionNumber }) {
  const [answer, setAnswer] = useState('');
  
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Question {questionNumber}</h3>
        <p className="text-muted-foreground">{question.text}</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Your Answer</h4>
        <Textarea 
          placeholder="Type your answer here..."
          value={answer}
          onChange={handleAnswerChange}
          rows={6}
          className="w-full resize-none focus:border-primary"
        />
      </div>
    </div>
  );
} 