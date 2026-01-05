import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Calendar, Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import DisplayTechIcons from "./DisplayTechIcons";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";

function InterviewCard({ id, userId, role, type, techStack, createdAt }) {
  const feedback = null;

  const normalizedType = /mixed/i.test(type) ? "Mixed" : type;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM DD, YYYY");

  return (
    <div className="card-border w-[320px] max-sm:w-full">
      <div className="card-interview bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between relative">

        {/* Badge */}
        <div className="absolute top-0 right-0 px-4 py-2 rounded-bl-lg bg-secondary">
          <p className="badge-text text-primary">
            {normalizedType}
          </p>
        </div>

        {/* Icon + Title */}
        <div>
          <Image
            src={getRandomInterviewCover()}
            alt="cover-img"
            width={50}
            height={50}
            className="rounded-full size-[50px]"
          />

          <h3 className="mt-3 text-lg font-semibold text-foreground capitalize">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-6 mt-3 text-muted-text">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <p className="text-sm">{formattedDate}</p>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <p className="text-sm">
                {feedback?.totalScore || "---"}/100
              </p>
            </div>
          </div>

          {/* Feedback / Placeholder */}
          <p className="line-clamp-2 mt-5 text-muted-text">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills!"}
          </p>
        </div>

        {/* Tech icons and button */}
        <div className="flex flex-row justify-between items-center mt-6">
          <DisplayTechIcons techStack={techStack} />

          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
