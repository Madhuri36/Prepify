import {generateText} from "ai";
import {google} from "@ai-sdk/google" 
import { getRandomInterviewCover } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";


export async function GET(){
    return Response.json({success:true, data:'THANK YOU!'},{status:200});
}

export async function POST(request){
    const supabase = createClient();
    const {type, role, level, techStack, amount, userid } = await request.json();

    try {
        const {text: questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt:`Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techStack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview={
        role,
        level,
        techStack: techStack.split(','),
        type,
        amount,
        questions: JSON.parse(questions),
        userId: userid,
        finalized:true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString(),
    }

    await supabase.from("interviews").insert([interview]);
    return Response.json({success:true},{status:200});
    } catch (error) {
        console.error(error);
        return Response.json({success:false, error}, {status:500});
    }
}