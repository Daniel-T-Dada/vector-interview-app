export async function POST(request) {
    try {
        
        const data = await request.json();

        if (!data.title ||!data.description ||!data.questions ||data.questions.length === 0
        ) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Missing required fields",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    id: Math.random().toString(36).substring(2, 15),
                    ...data,
                    createdAt: new Date().toISOString(),
                },
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating interview:", error);

        return new Response(
            JSON.stringify({
                success: false,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
