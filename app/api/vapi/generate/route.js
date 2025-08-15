import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    return Response.json({ success: true, data: 'THANK YOU!' }, { status: 200 });
}

export async function POST(request) {
    const supabase = await createClient();
    
    try {
        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('Authentication error:', authError);
            return Response.json({ 
                success: false, 
                error: 'User not authenticated' 
            }, { status: 401 });
        }

        // Parse and log request body
        const body = await request.json();
        console.log('Incoming request body:', body);

        const { type, role, level, techStack, amount , userid} = body;

        // Check required fields individually
        const missingFields = [];
        if (!type) missingFields.push('type');
        if (!role) missingFields.push('role');
        if (!level) missingFields.push('level');
        if (!techStack || (Array.isArray(techStack) && techStack.length === 0)) missingFields.push('techStack');
        if (!amount) missingFields.push('amount');

        if (missingFields.length > 0) {
            return Response.json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Generate interview questions
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${Array.isArray(techStack) ? techStack.join(', ') : techStack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3`
        });

        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questions);
        } catch (parseError) {
            console.error('Failed to parse questions:', parseError, questions);
            return Response.json({ 
                success: false, 
                error: 'Failed to generate questions'
            }, { status: 500 });
        }

        // Build interview object
        const interview = {
            role,
            level,
            tech_stack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
            type,
            amount: parseInt(amount),
            questions: parsedQuestions,
            user_id: user.id,
            finalized: true,
            cover_image: getRandomInterviewCover(),
            created_at: new Date().toISOString(),
        };

        // Insert into DB
        const { data, error: insertError } = await supabase
            .from("interviews")
            .insert([interview])
            .select();

        if (insertError) {
            console.error('Database insert error:', insertError);
            return Response.json({ 
                success: false, 
                error: 'Failed to save interview',
                details: insertError.message 
            }, { status: 500 });
        }

        return Response.json({ 
            success: true, 
            data: data[0]
        }, { status: 200 });

    } catch (error) {
        console.error('Unexpected error:', error);
        return Response.json({ 
            success: false, 
            error: 'An unexpected error occurred',
            details: error.message 
        }, { status: 500 });
    }
}
