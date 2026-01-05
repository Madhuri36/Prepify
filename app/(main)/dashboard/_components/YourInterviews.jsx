import InterviewCard from "./InterviewCard";
import { getUser } from "@/app/actions/auth";
import { getInterviewByUserId, getLatestInterviews } from "@/app/actions/general.action";

async function YourInterviews() {
  const { user } = await getUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    user ? getInterviewByUserId(user.id) : [],
    user ? getLatestInterviews({ userId: user.id }) : [],
  ]);

  return (
    <section className="flex flex-col gap-10 mt-8">
      {/* Your Interviews */}
      <div>
        <h2 className="text-2xl font-bold">Your Interviews</h2>
        <div className="mt-5 flex flex-wrap gap-6 max-lg:flex-col">
          {userInterviews.length > 0 ? (
            userInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="text-gray-500">You haven&apos;t conducted any interviews yet</p>
          )}
        </div>
      </div>

      {/* Take Interview */}
      <div>
        <h2 className="text-2xl font-bold">Take an Interview</h2>
        <div className="mt-5 flex flex-wrap gap-6 max-lg:flex-col">
          {latestInterviews.length > 0 ? (
            latestInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="text-gray-500">No interviews available right now</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default YourInterviews;
