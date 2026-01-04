import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { getRandomInterviewCover } from "@/lib/utils";

// --------------------
// Groq client
// --------------------
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// --------------------
// Health check
// --------------------
export async function GET() {
  return Response.json({
    success: true,
    message: "Interview API is live"
  });
}

// --------------------
// POST handler (Vapi Tool)
// --------------------
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Incoming request body:", body);

    const { type, role, level, techStack, amount, userid } = body;

    // ---- Validation ----
    if (!type || !role || !level || !techStack || !amount || !userid) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ---- Supabase (SERVICE ROLE, server-only) ----
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ---- Normalize tech stack ----
    const normalizedTechStack = Array.isArray(techStack)
      ? techStack
      : techStack.split(",").map(t => t.trim());

    // ---- Generate questions (Groq) ----
    let questions;

    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You generate interview questions. Respond ONLY with valid JSON."
          },
          {
            role: "user",
            content: `
Return ONLY a JSON array of ${amount} interview questions.
No explanations. No markdown.

Role: ${role}
Level: ${level}
Tech stack: ${normalizedTechStack.join(", ")}
Focus: ${type}
`
          }
        ]
      });

      const text = completion.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("Empty response from Groq");
      }

      questions = JSON.parse(text);

    } catch (err) {
      console.error("⚠️ Groq failed, using fallback:", err.message);

      // ---- Guaranteed fallback (Vapi-safe) ----
      questions = [
        "Explain the difference between an array and a linked list",
        "What is a closure in JavaScript",
        "Explain time and space complexity",
        "What is REST API",
        "Difference between SQL and NoSQL databases",
        "Explain React component lifecycle"
      ].slice(0, Number(amount));
    }

    // ---- Build interview record ----
    const interview = {
      role,
      level,
      techStack: normalizedTechStack,
      type,
      amount: Number(amount),
      questions,
      user_id: userid,
      finalized: true,
      cover_image: getRandomInterviewCover(),
      created_at: new Date().toISOString()
    };

    // ---- Insert into Supabase ----
    const { data, error } = await supabase
      .from("interviews")
      .insert([interview])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    // ---- SUCCESS (Vapi sees this as completed) ----
    return Response.json({
      success: true,
      interview: data
    });

  } catch (error) {
    console.error("❌ API Error:", error);

    // IMPORTANT:
    // Even on error, return JSON so Vapi doesn't explode
    return Response.json(
      {
        success: false,
        error: "Interview generation failed"
      },
      { status: 200 }
    );
  }
}
