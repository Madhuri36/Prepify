import React from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";
import { getUser } from "@/app/actions/auth";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/app/actions/general.action";

async function AllInterviewsPage() {
  const { user } = await getUser();

  const [userInterviews, otherInterviews] = await Promise.all([
    user ? getInterviewByUserId(user.id, 100) : [],
    user ? getLatestInterviews({ userId: user.id, limit: 100 }) : [],
  ]);

  const allInterviews = [
    ...(userInterviews || []),
    ...(otherInterviews || []),
  ];

  return (
    <section className="flex flex-col gap-8 mt-6">
      <div>
        <h1 className="text-3xl font-bold">All Interviews</h1>
        <p className="text-muted-text mt-1">
          Explore interviews created by you and others
        </p>
      </div>

      <div className="flex flex-wrap gap-6 max-lg:flex-col w-full items-stretch">
        {allInterviews.length > 0 ? (
          allInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              {...interview}
              userId={user.id} // ✅ THIS FIXES IT
            />
          ))
        ) : (
          <p className="text-muted-text">
            No interviews available right now
          </p>
        )}
      </div>
    </section>
  );
}

export default AllInterviewsPage;
