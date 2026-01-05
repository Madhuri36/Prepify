import React from "react";
import { redirect } from "next/navigation";
import { getInterviewById } from "@/app/actions/general.action";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "../../dashboard/_components/DisplayTechIcons";
import Agent from "../_components/Agent";
import { getUser } from "@/app/actions/auth";

const Page = async ({ params }) => {
  const { id } = params;
  const { user } = await getUser();

  const interview = await getInterviewById(id);

  if (!interview) {
    redirect("/dashboard");
  }

  const normalizedType = /mixed/i.test(interview.type)
    ? "Mixed"
    : interview.type;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-6">

        {/* LEFT: Cover + Title + Tech */}
        <div className="flex items-center gap-4 min-w-0">
          <Image
            src={getRandomInterviewCover()}
            alt="interview-cover"
            width={40}
            height={40}
            className="rounded-full size-[40px] flex-shrink-0"
          />

          <h1 className="text-lg font-semibold text-foreground capitalize whitespace-nowrap">
            {interview.role} Interview
          </h1>

          <DisplayTechIcons techStack={interview.techStack} />
        </div>

        {/* RIGHT: Badge */}
        <div className="px-4 py-2 rounded-lg bg-secondary">
          <p className="badge-text text-primary capitalize">
            {normalizedType}
          </p>
        </div>
      </div>

      {/* AGENT */}
      <Agent
        userName={user?.name}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </div>
  );
};

export default Page;
