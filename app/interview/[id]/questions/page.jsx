'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getInterviewById } from '@/lib/services/interview-service';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/interview/timer';
import { QuestionDisplay } from '@/components/interview/question-display';
import confetti from 'canvas-confetti';
import Head from 'next/head';

export default function InterviewQuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [candidateName, setCandidateName] = useState('');
    const [responses, setResponses] = useState([]); // To store video and text responses
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Check if candidate has entered their name to make it unique for them. 
    // They will see their name on the interview page...That should make them happy...😁😁
    useEffect(() => {
        const storedName = sessionStorage.getItem('candidateName');
        const storedInterviewId = sessionStorage.getItem('interviewId');
        
        if (!storedName || storedInterviewId !== id) {
            // If they refuse to enter their name, we will redurect them back to the gateway page
            router.push(`/interview/${id}`);
            return;
        }
        
        setCandidateName(storedName);
    }, [id, router]);

    // Fetch interview data
    useEffect(() => {
        const fetchInterview = async () => {
            try {
                setLoading(true);
                const response = await getInterviewById(id);
                
                if (!response) {
                    setError('Interview not found');
                    return;
                }
                
                
                const data = response.data ? response.data : response;
                
                // Ensure questions array exists
                if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
                    setError('No questions available for this interview');
                    return;
                }
                
                setInterview(data);
                // Initialize responses array with empty values for each question
                setResponses(new Array(data.questions.length).fill({ text: '', video: null }));
            } catch (err) {
                setError('Failed to load interview');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    // When the candidate is done and clicks on the finish button, it will trigger the confetti effect which blows around the screeen...sharp
    const finishInterview = useCallback(() => {
        setIsSubmitting(true);
        
        
        setTimeout(() => {
            setIsFinished(true);
            setIsSubmitting(false);
            
            // So the camera and microphone will be turned off when the candidate is done with the interview
            const mediaStreams = document.querySelectorAll('video');
            mediaStreams.forEach(video => {
                if (video.srcObject) {
                    const tracks = video.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                    video.srcObject = null;
                }
            });
            
            // This is what will now trigger the confetti effect
            launchConfetti();
            
            console.log("All responses:", responses);
            
            // As i went through the code several times and the video is not recording. 
            // TO see if the console will show that the video sha save first. 
            const videosRecorded = responses.filter(r => r.video !== null).length;
            console.log(`Recorded videos: ${videosRecorded}/${responses.length} questions`);
        }, 1500);
    }, [responses]);

    // Handle next question
    const handleNextQuestion = useCallback(() => {
        if (interview && interview.questions && currentQuestionIndex < interview.questions.length - 1) {
            // This will chck if the candidate use text or video or even the two.
            const currentResponse = responses[currentQuestionIndex];
            const hasResponse = currentResponse.text.trim() !== '' || currentResponse.video !== null;
            
            
            setCurrentQuestionIndex(prevIndex => {
                console.log(`Moving from question ${prevIndex + 1} to ${prevIndex + 2}`);
                return prevIndex + 1;
            });
        } else {
            finishInterview();
        }
    }, [interview, currentQuestionIndex, responses, finishInterview]);
    
    // Handle response update (for both text and video)
    const handleResponseUpdate = useCallback((type, data) => {
        setResponses(prev => {
            const newResponses = [...prev];
            
            // Make sure the question index exists
            if (currentQuestionIndex >= newResponses.length) {
                console.error(`Invalid question index: ${currentQuestionIndex}, responses length: ${newResponses.length}`);
                return prev;
            }
            
            // Create response object if it doesn't exist
            if (!newResponses[currentQuestionIndex]) {
                newResponses[currentQuestionIndex] = { text: '', video: null };
            }
            
            // Update the response
            newResponses[currentQuestionIndex] = {
                ...newResponses[currentQuestionIndex],
                [type]: data
            };
            
            return newResponses;
        });
        
        // My eyes in the console...
        if (type === 'video') {
            if (data) {
                console.log(`Video for question ${currentQuestionIndex + 1} updated, size: ${Math.round(data.size / 1024)} KB`);
            } else {
                console.log(`Video for question ${currentQuestionIndex + 1} cleared`);
            }
        }
    }, [currentQuestionIndex]);

    // Confetti effect
    const launchConfetti = useCallback(() => {
        if (typeof window !== 'undefined') {
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#26a69a', '#00897b', '#004d40'],
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#1976d2', '#0d47a1', '#01579b'],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, []);

    // we use this one to make sure the user camera is switechd off wehn they finish the interview. 
    // User privacy matters...lol
    useEffect(() => {
        return () => {
            const mediaStreams = document.querySelectorAll('video');
            mediaStreams.forEach(video => {
                if (video.srcObject) {
                    const tracks = video.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                    video.srcObject = null;
                }
            });
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse text-xl">Loading interview...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="w-full max-w-3xl">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-500">Error</h2>
                            <p className="mt-2">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!interview || !interview.questions) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Interview not found</div>
            </div>
        );
    }

    const currentQuestion = interview.questions[currentQuestionIndex];
    const timeLimit = currentQuestion && currentQuestion.timeLimit ? currentQuestion.timeLimit : 120;
    const currentResponse = responses[currentQuestionIndex];

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader className="text-center border-b">
                        <CardTitle className="text-2xl">
                            {interview.title || "Interview Session"}
                        </CardTitle>
                        <div className="flex flex-col space-y-1">
                            <p className="text-muted-foreground">
                                {interview.position || "Candidate Interview"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Candidate: {candidateName}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {isFinished ? (
                            <div className="text-center py-12">
                                <h2 className="text-2xl font-bold mb-4">Interview Completed</h2>
                                <p className="mb-3 text-muted-foreground">
                                    Thank you for completing this interview, {candidateName}.
                                </p>
                                <p className="mb-6 text-muted-foreground">
                                    Your responses have been recorded and will be reviewed by our team.
                                    You will be contacted shortly regarding next steps in the hiring process.
                                </p>
                                <div className="p-6 bg-muted rounded-lg max-w-md mx-auto mb-8">
                                    <p className="text-sm font-medium mb-2">What happens next?</p>
                                    <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-2">
                                        <li>Our team will review your interview responses</li>
                                        <li>Shortlisted candidates will be contacted for the next round</li>
                                        <li>The hiring process typically takes 1-2 weeks</li>
                                    </ol>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    You may now close this window.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="text-sm font-medium">
                                            Question {currentQuestionIndex + 1} of {interview.questions.length}
                                        </span>
                                    </div>
                                    <Timer 
                                        duration={timeLimit} 
                                        onTimeUp={handleNextQuestion} 
                                        key={currentQuestionIndex} 
                                    />
                                </div>

                                <QuestionDisplay
                                    question={currentQuestion}
                                    questionNumber={currentQuestionIndex + 1}
                                    onTextChange={(text) => handleResponseUpdate('text', text)}
                                    onVideoRecord={(blob) => handleResponseUpdate('video', blob)}
                                    currentResponse={responses[currentQuestionIndex]}
                                />

                                <div className="mt-8 flex justify-end">
                                    <Button onClick={handleNextQuestion} disabled={isSubmitting}>
                                        {currentQuestionIndex < interview.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 