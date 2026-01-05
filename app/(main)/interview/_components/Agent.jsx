"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";

const CALL_STATUS = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

export default function Agent({
  userName,
  userId,
  type = "generate",
  questions = [],
  interviewId
}) {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState(CALL_STATUS.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);

  /* -------------------- VAPI EVENTS (UNCHANGED) -------------------- */
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CALL_STATUS.FINISHED);
      setIsSpeaking(false);
      setIsUserSpeaking(false);
    };

    const onMessage = (message) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "partial") {
          if (message.role === "assistant") {
            setIsSpeaking(true);
            setIsUserSpeaking(false);
          } else {
            setIsUserSpeaking(true);
            setIsSpeaking(false);
          }
        }

        if (message.transcriptType === "final") {
          setMessages((prev) => [
            ...prev,
            { role: message.role, content: message.transcript },
          ]);
          setIsSpeaking(false);
          setIsUserSpeaking(false);
        }
      }
    };

    const onSpeechStart = (data) => {
      if (data?.role === "user") {
        setIsUserSpeaking(true);
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        setIsUserSpeaking(false);
      }
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
      setIsUserSpeaking(false);
    };

    const onError = () => {
      setCallStatus(CALL_STATUS.INACTIVE);
      setIsSpeaking(false);
      setIsUserSpeaking(false);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  //  TODO
  const handleGenerateFeedback = async (messages ) => {
    console.log("Generate Feedback here.")
    const {success,id}={success:true,id:"feedback-id"}
    if(success && id){
      router.push(`/interview/${interviewId}/feedback`);
    } else{
      console.log(("Error generating feedback."));
      router.push("/dashboard");
    }
  }

  /* -------------------- REDIRECT -------------------- */
  useEffect(() => {
    if(callStatus === CALL_STATUS.FINISHED){
      if(type==="generate"){
        setTimeout(() => router.push("/dashboard"), 1000);
      } else{
        handleGenerateFeedback(messages);
      }
    }
  }, [callStatus, router]);

  /* -------------------- ACTIONS (UNCHANGED) -------------------- */
  const handleStartCall = async () => {
    try {
      setCallStatus(CALL_STATUS.CONNECTING);

      if (type === "generate") {
        await vapi.start(
          undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
          {
            variableValues: {
              username: userName,
              userid: userId,
            },
          }
        );
      } else {
        let formattedQuestions="";
        if(questions){
          formattedQuestions = questions
  .map((question) => `- ${question}`)
  .join("\n");

        }
        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions
          },
        });
      }
    } catch {
      setCallStatus(CALL_STATUS.INACTIVE);
    }
  };

  const handleEndCall = async () => {
    try {
      setCallStatus(CALL_STATUS.FINISHED);
      await vapi.stop();
    } catch {}
  };

  const lastMessage = messages[messages.length - 1]?.content;

  /* -------------------- UI (FROM SECOND CODE) -------------------- */
  return (
    <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6">
      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* AI */}
        <div className="relative">
          <div className="h-[320px] bg-gradient-to-br from-[#DDDFFF] to-white rounded-2xl border shadow-lg flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-4">
                <div
                  className={`w-24 h-24 bg-[#4F39F6] rounded-full flex items-center justify-center shadow-xl ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                >
                  <MessageCircle className="text-white w-12 h-12" />
                </div>
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-20" />
                )}
              </div>
              <h3 className="text-xl font-bold">AI Interviewer</h3>
              {isSpeaking && (
                <p className="text-sm text-indigo-600 animate-pulse mt-1">
                  Speaking...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* USER */}
        <div className="relative hidden md:block">
          <div className="h-[320px] bg-gradient-to-br from-white to-[#DDDFFF] rounded-2xl border shadow-lg flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-4">
                <div
                  className={`w-24 h-24 bg-[#4F39F6] rounded-full flex items-center justify-center shadow-xl ${
                    isUserSpeaking ? "animate-pulse" : ""
                  }`}
                >
                  <User className="text-white w-12 h-12" />
                </div>
                {isUserSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-20" />
                )}
              </div>
              <h3 className="text-xl font-bold">{userName}</h3>
              {isUserSpeaking && (
                <p className="text-sm text-indigo-600 animate-pulse mt-1">
                  Speaking...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSCRIPT */}
      {lastMessage && (
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <p className="text-gray-800 animate-fadeIn">{lastMessage}</p>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex justify-center">
        {callStatus === CALL_STATUS.ACTIVE ? (
          <button
            onClick={handleEndCall}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition"
          >
            End Call
          </button>
        ) : (
          <button
            onClick={handleStartCall}
            disabled={callStatus === CALL_STATUS.CONNECTING}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition disabled:opacity-50"
          >
            {callStatus === CALL_STATUS.CONNECTING
              ? "Connecting..."
              : "Start Call"}
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
