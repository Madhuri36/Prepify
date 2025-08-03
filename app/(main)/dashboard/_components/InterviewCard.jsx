import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Calendar, Code, Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import DisplayTechIcons from "./DisplayTechIcons";

function InterviewCard({ id, userId, role, type, techstack, createdAt }) {
  const feedback = null;
  const normalizedType = /mixed/i.test(type) ? "Mixed" : type;
  const foramttedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM DD, YYYY");
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-violet-500">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <Code className="text-violet-500 w-9 h-9 absolute object-fit top-2 left-4" />
          <h3 className="mt-5 capitalize">{role} Inteview</h3>
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Calendar className="w-5 h-5" />
              <p className="mr-4 text-sm">{foramttedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Star className="w-5 h-5" />
              <p className="text-sm">{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills!"}
          </p>
        </div>
        <div className="flex flex-row justify-between">
            <DisplayTechIcons techStack={techstack} />
            <Button className={'btn-primary'}>
                <Link href={feedback? `/interview/${id}/feedback` : `/interview/${id}`}>
                {feedback ? "Check Feedback" : "view Interview"}
                </Link>
            </Button>


        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
