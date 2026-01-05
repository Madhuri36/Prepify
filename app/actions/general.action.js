"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { feedbackSchema } from "@/constants";
import Groq from "groq-sdk";
import { int } from "zod";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ----------------- GET INTERVIEWS BY USER ID -----------------
export async function getInterviewByUserId(userId, limit = 6) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .limit(limit)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching interviews:", error.message);
    return null;
  }

  return data;
}

// ----------------- GET LATEST INTERVIEWS (EXCEPT USER) -----------------
export async function getLatestInterviews({ userId, limit = 20 }) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("interviews")
    .select("*")
    .eq("finalized", true)
    .neq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data;
}

// ----------------- GET INTERVIEW BY ID -----------------
export async function getInterviewById(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .single(); // ensures only one row is returned

  if (error) {
    console.error("Error fetching interview:", error.message);
    return null;
  }

  return data;
}

export async function createFeedback(params) {
  const { interviewId, userId, transcript } = params;
  const supabase = await createClient();

  try {
    const formattedTranscript = transcript
      .map((s) => `- ${s.role}: ${s.content}\n`)
      .join("");

    const completion = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  temperature: 0.5,
  messages: [
    {
      role: "system",
      content:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.",
    },
    {
      role: "user",
      content: `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Do not be lenient with the candidate. If there are mistakes or areas for improvement, point them out clearly.

Transcript:
${formattedTranscript}

Please score the candidate from 0 to 100 in the following areas. Do NOT add or remove categories:
For EACH category comment:
- Write at least 3–4 full sentences
- Mention specific moments from the transcript
- Clearly justify the score

For finalAssessment:
- Write a detailed paragraph (5-6 sentences)
- Sound like a real interviewer giving feedback

- Communication Skills: Clarity, articulation, structured responses.
- Technical Knowledge: Understanding of key concepts for the role.
- Problem Solving: Ability to analyze problems and propose solutions.
- Cultural & Role Fit: Alignment with company values and job role.
- Confidence & Clarity: Confidence in responses, engagement, and clarity.

Return ONLY valid JSON in the following format (no markdown, no explanation):

{
  "totalScore": number,
  "categoryScores": [
    { "name": "Communication Skills", "score": number, "comment": string },
    { "name": "Technical Knowledge", "score": number, "comment": string },
    { "name": "Problem Solving", "score": number, "comment": string },
    { "name": "Cultural Fit", "score": number, "comment": string },
    { "name": "Confidence and Clarity", "score": number, "comment": string }
  ],
  "strengths": string[],
  "areasForImprovement": string[],
  "finalAssessment": string
}
      `,
    },
  ],
});


    const raw = completion.choices[0].message.content.trim();
    const parsed = JSON.parse(raw);
    const validated = feedbackSchema.parse(parsed);

    const { data, error } = await supabase
      .from("feedback")
      .insert({
        interview_id: interviewId,
        user_id: userId,
        total_score: validated.totalScore,
        category_scores: validated.categoryScores,
        strengths: validated.strengths,
        areas_for_improvement: validated.areasForImprovement,
        final_assessment: validated.finalAssessment,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      feedbackId: data.id,
      feedback: validated,
    };
  } catch (e) {
    console.error("Feedback generation failed:", e);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(params) {
  const { interviewId, userId } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("interview_id", interviewId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error) {
    // No row found OR actual error
    console.error("Error fetching feedback:", error.message);
    return null;
  }

  return data;
}
