import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Star, Calendar } from "lucide-react";

import {
  getInterviewById,
  getFeedbackByInterviewId,
} from "@/app/actions/general.action";
import { getUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const FeedbackPage = async ({ params }) => {
  const { id } = params;

  // ✅ KEEP YOUR AUTH LOGIC
  const { user } = await getUser();
  if (!user) redirect("/");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-muted-foreground">
        No feedback available.
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* TITLE */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Feedback on the Interview –{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>

        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>
              Overall Impression: <strong>{feedback.total_score}/100</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {dayjs(feedback.created_at).format("MMM D, YYYY h:mm A")}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* FINAL ASSESSMENT */}
      <p className="text-muted-foreground leading-relaxed">
        {feedback.final_assessment}
      </p>

      {/* BREAKDOWN */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Breakdown of the Interview:</h2>

        {(feedback.category_scores || []).map((category, index) => (
          <div key={index} className="space-y-1">
            <p className="font-semibold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p className="text-muted-foreground">{category.comment}</p>
          </div>
        ))}
      </div>

      {/* STRENGTHS */}
      {feedback.strengths?.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Strengths</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {feedback.strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AREAS FOR IMPROVEMENT */}
      {feedback.areas_for_improvement?.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Areas for Improvement</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {feedback.areas_for_improvement.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-center gap-4 pt-8">
        <Button
          variant="secondary"
          className="px-6 py-2 rounded-lg text-sm font-medium"
        >
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>

        <Button className="px-6 py-2 rounded-lg text-sm font-medium">
          <Link href={`/interview/${id}`}>Retake Interview</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;
