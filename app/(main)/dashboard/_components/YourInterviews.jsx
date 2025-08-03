import { dummyInterviews } from "@/constants";
import React from "react";
import InterviewCard from "./InterviewCard";

function YourInterviews() {
  return (
    <section className="flex flex-col gap-6 mt-8 space-y-3">
      <div>
        <h2 className="text-2xl font-bold">Your Interviews</h2>
        <div className="interview-section mt-3">
          {dummyInterviews.map((interview) => (
             <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Take an Interview</h2>
        <div className="interview-section mt-3">
          {dummyInterviews.map((interview) => (
             <InterviewCard key={interview.id} {...interview} />
          ))}
          <p>You haven&apos;t taken any interviews yet</p>
        </div>
      </div>
    </section>
  );
}

export default YourInterviews;
