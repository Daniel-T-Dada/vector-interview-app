import { interviews } from "@/lib/data/interviews";
import { mockQuestions } from "@/lib/services/interview-service";

export async function GET(request, { params }) {
    try {
        // Make sure we await params before accessing its properties
        const resolvedParams = await Promise.resolve(params);
        const id = resolvedParams.id;
        
        // Find the interview in our data
        const interview = interviews.find(interview => interview.id === id);
        
        if (!interview) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Interview not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        //Since we dont have real questions, we will use mock questions wihch i set in the interview-service.js file
        const questions = interview.questions || mockQuestions[id] || mockQuestions.default;
        
        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    ...interview,
                    questions
                }
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching interview:", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
} 