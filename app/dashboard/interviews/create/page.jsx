'use client'

import { useState } from 'react';
import { createInterview } from '@/lib/services/interview-service';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CreateInterviewPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questions: [{ text: '', type: 'text', timeLimit: 120 }]
    });
    const [errors, setErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // to change the interview question if we dont like it or the boss says so...lol
    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
        if (errors[`question-${index}-${field}`]) {
            setErrors({...errors,
                [`question-${index}-${field}`]: null
            });
        }
    };

    // So this is where users will be able to add more questions to the interview list
    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { text: '', type: 'text', timeLimit: 120 }]
        });
    };

    // this function is what we use to delete a question we no like from the interview list. No time
    const removeQuestion = (index) => {
        if (formData.questions.length > 1) {
            const updatedQuestions = formData.questions.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                questions: updatedQuestions
            });
        }
    };

    // This function helps us to make sure that th e input fileds are not just empty. Doesnt make sense!
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }
        formData.questions.forEach((question, index) => {
            if (!question.text.trim()) {
                newErrors[`question-${index}-text`] = "Question text is required";
            }
            if (!question.timeLimit || question.timeLimit < 30) {
                newErrors[`question-${index}-timeLimit`] = "Time limit must be at least 30 seconds";
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            //Ehen, when user clicks on the button our mock API is called sharpally
            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create interview');
            }
            
            const result = await response.json();
            
            // Show success toast
            toast({
                title: "Interview Created",
                description: "Your interview has been successfully created.",
                variant: "success",
            });
            
            // If the API calls succeeds, the user is taken straing to the interview list
            router.push("/dashboard/interviews");
        } catch (error) {
            // if mistake dey
            toast({
                title: "Error",
                description: "Failed to create interview. Please try again.",
                variant: "destructive",
            });
            console.error("Failed to create interview:", error); //Remember to rrmove this later Dan after  i am done with the toast message implementation
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Button 
                    variant="ghost" 
                    className="mr-2" 
                    onClick={() => router.push("/dashboard/interviews")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Create New Interveiw</h1>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Interview Details</CardTitle>
                    <CardDescription>
                        Add your interview quesion here
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Interview Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={errors.description ? "border-red-500" : ""}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Questions</Label>
                                <Button 
                                    type="button" 
                                    onClick={addQuestion} 
                                    variant="outline" 
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Question
                                </Button>
                            </div>
                            
                            {formData.questions.map((question, index) => (
                                <div key={index} className="p-4 border rounded-md space-y-2">
                                    <div className="flex justify-between items-start">
                                        <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeQuestion(index)}
                                            disabled={formData.questions.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        id={`question-${index}`}
                                        value={question.text}
                                        onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                                        className={errors[`question-${index}-text`] ? "border-red-500" : ""}
                                        rows={2}
                                    />
                                    {errors[`question-${index}-text`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`question-${index}-text`]}</p>
                                    )}
                                    
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Label htmlFor={`timelimit-${index}`} className="w-1/3">Time Limit (seconds):</Label>
                                        <Input
                                            id={`timelimit-${index}`}
                                            type="number"
                                            min="30"
                                            value={question.timeLimit}
                                            onChange={(e) => handleQuestionChange(index, 'timeLimit', parseInt(e.target.value) || 30)}
                                            className={`w-1/3 ${errors[`question-${index}-timeLimit`] ? "border-red-500" : ""}`}
                                        />
                                    </div>
                                    {errors[`question-${index}-timeLimit`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`question-${index}-timeLimit`]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/interviews")}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Interview"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

