'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoRecorder } from '@/components/interview/video-recorder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function QuestionDisplay({ question, questionNumber, onTextChange, onVideoRecord, currentResponse }) {
  const [answer, setAnswer] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [key, setKey] = useState(0); 
  
  const onTextChangeRef = useRef(onTextChange);
  const onVideoRecordRef = useRef(onVideoRecord);
  
  // Update refs when props change
  useEffect(() => {
    onTextChangeRef.current = onTextChange;
    onVideoRecordRef.current = onVideoRecord;
  }, [onTextChange, onVideoRecord]);
  
  // Reset the VideoRecorder when the question changes
  useEffect(() => {
    
    setKey(prevKey => prevKey + 1);
  }, [questionNumber]);
  
  // Initialize answer from props if available
  useEffect(() => {
    if (currentResponse && currentResponse.text) {
      setAnswer(currentResponse.text);
    } else {
      setAnswer('');
    }
  }, [currentResponse, questionNumber]);
  
  const handleAnswerChange = useCallback((e) => {
    const text = e.target.value;
    setAnswer(text);
    if (onTextChangeRef.current) {
      onTextChangeRef.current(text);
    }
  }, []);
  
  const handleVideoRecorded = useCallback((blob) => {
    if (onVideoRecordRef.current) {
      onVideoRecordRef.current(blob);
    }
  }, []);
  
  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Question {questionNumber}</h3>
        <p className="text-muted-foreground">{question.text}</p>
      </div>
      
      <Tabs defaultValue="text" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Answer</TabsTrigger>
          <TabsTrigger value="video">Video Answer</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-2 mt-4">
          <h4 className="font-medium">Your Answer</h4>
          <Textarea 
            placeholder="Type your answer here..."
            value={answer}
            onChange={handleAnswerChange}
            rows={6}
            className="w-full resize-none focus:border-primary"
          />
        </TabsContent>
        <TabsContent value="video" className="space-y-2 mt-4">
          <h4 className="font-medium">Record Your Answer</h4>
          <VideoRecorder 
            key={key} 
            onRecorded={handleVideoRecorded} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 