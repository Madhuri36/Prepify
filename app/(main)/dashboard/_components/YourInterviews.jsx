import React from "react";
import InterviewCard from "./InterviewCard";
import { getUser } from "@/app/actions/auth";
import { getInterviewByUserId } from "@/app/actions/auth";
import { getLatestInterviews } from "@/app/actions/auth.js"; // adjust path if needed

async function YourInterviews() {
  const { user } = await getUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    user ? getInterviewByUserId(user.id) : [],
    user ? getLatestInterviews({ userId: user.id }) : [],
  ]);

  const hasPastInterviews = userInterviews.length > 0;
  const hasLatestInterviews = latestInterviews.length > 0;

  return (
    <section className="flex flex-col gap-10 mt-8">
      {/* YOUR INTERVIEWS */}
      <div>
        <h2 className="text-2xl font-bold">Your Interviews</h2>

        <div className="mt-5 flex flex-wrap gap-6 max-lg:flex-col w-full items-stretch">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="text-gray-500">
              You haven&apos;t conducted any interviews yet
            </p>
          )}
        </div>
      </div>

      {/* TAKE AN INTERVIEW */}
      <div>
        <h2 className="text-2xl font-bold">Take an Interview</h2>

        <div className="mt-5 flex flex-wrap gap-6 max-lg:flex-col w-full items-stretch">
          {hasLatestInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="text-gray-500">
              No interviews available right now
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default YourInterviews;
