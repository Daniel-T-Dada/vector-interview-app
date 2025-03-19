'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getInterviewById, saveCandidateInfo } from '@/lib/services/interview-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InterviewGateway() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [candidateName, setCandidateName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [interviewDetails, setInterviewDetails] = useState(null);

    // Fetch basic interview details
    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                const data = await getInterviewById(id);
                
                if (!data) {
                    setError('Interview not found');
                    return;
                }
                
                const details = data.data ? data.data : data;
                setInterviewDetails(details);
                
            } catch (err) {
                setError('Failed to load interview details');
                console.error(err);
            }
        };

        fetchInterviewDetails();
    }, [id]);

    const handleStartInterview = async (e) => {
        e.preventDefault();
        
        if (!candidateName.trim()) {
            setError('Please enter your name to continue');
            return;
        }
        
        setLoading(true);
        
        try {
            // This make sure that the candidate name is saved so that it can be displayed on their interview page
            await saveCandidateInfo(id, candidateName);
            
            // Store in session for the current browser session
            sessionStorage.setItem('candidateName', candidateName);
            sessionStorage.setItem('interviewId', id);
            
            // Navigate to the actual interview page
            router.push(`/interview/${id}/questions`);
        } catch (err) {
            setError('Failed to start interview. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {interviewDetails?.title || "Welcome to your Interview"}
                    </CardTitle>
                    <CardDescription>
                        {interviewDetails?.position 
                            ? `Position: ${interviewDetails.position}` 
                            : "Please enter your name to continue"}
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleStartInterview}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                required
                            />
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                You are about to start an interview. Once you begin:
                            </p>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                <li>You will see one question at a time</li>
                                <li>Each question has a time limit</li>
                                <li>You will be taken tto the next question when time runs out</li>
                                <li>You can mclick on "Next Question" if you are done with the current question before time runs out</li>
                            </ul>
                        </div>
                    </CardContent>
                    
                    <CardFooter>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                        >
                            {loading ? "Starting..." : "Start Interview"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 