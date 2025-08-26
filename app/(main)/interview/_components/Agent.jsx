"use client";
import React, { useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";

const CALL_STATUS = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  CONNECTING: "CONNECTING",
  FINISHED: "FINISHED",
};

function Agent({ userName, userId, type, questions, interviewer }) {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState(CALL_STATUS.INACTIVE);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setCallStatus(CALL_STATUS.FINISHED);
      setIsSpeaking(false);
      setIsUserSpeaking(false);
    };

    const onMessage = (message) => {
      console.log("🔥 ALL MESSAGE RECEIVED:", JSON.stringify(message, null, 2));
      
      // Handle transcript messages to detect speech
      if (message.type === "transcript") {
        console.log("📝 Transcript:", message.transcriptType, "Role:", message.role, "Content:", message.transcript);
        
        if (message.transcriptType === "partial") {
          // Someone is currently speaking
          if (message.role === "user") {
            console.log("👤 USER IS SPEAKING (partial)");
            setIsUserSpeaking(true);
            setIsSpeaking(false);
          } else if (message.role === "assistant") {
            console.log("🤖 ASSISTANT IS SPEAKING (partial)");
            setIsSpeaking(true);
            setIsUserSpeaking(false);
          }
        } else if (message.transcriptType === "final") {
          // Speech has ended, add to messages
          const newMessage = { role: message.role, content: message.transcript };
          setMessages((prev) => [...prev, newMessage]);
          
          // Stop speaking indicators
          if (message.role === "user") {
            console.log("👤 USER STOPPED SPEAKING (final)");
            setIsUserSpeaking(false);
          } else if (message.role === "assistant") {
            console.log("🤖 ASSISTANT STOPPED SPEAKING (final)");
            setIsSpeaking(false);
          }
        }
      }
      
      // Handle other message types that might indicate speech
      if (message.type === "speech-start") {
        console.log("🎙️ SPEECH START:", message);
        if (message.role === "user") {
          console.log("👤 USER SPEECH START");
          setIsUserSpeaking(true);
          setIsSpeaking(false);
        } else {
          console.log("🤖 ASSISTANT SPEECH START");
          setIsSpeaking(true);
          setIsUserSpeaking(false);
        }
      }
      
      if (message.type === "speech-end") {
        console.log("🎙️ SPEECH END:", message);
        if (message.role === "user") {
          console.log("👤 USER SPEECH END");
          setIsUserSpeaking(false);
        } else {
          console.log("🤖 ASSISTANT SPEECH END");
          setIsSpeaking(false);
        }
      }

      // Check for any message type that contains "user" and indicates speech/speaking
      if (message.type && (
        message.type.includes("user") || 
        (message.role === "user" && (message.type.includes("speech") || message.type.includes("speaking")))
      )) {
        console.log("👤 DETECTED USER SPEECH EVENT:", message.type, message);
        if (message.type.includes("start") || message.type.includes("begin")) {
          setIsUserSpeaking(true);
          setIsSpeaking(false);
        } else if (message.type.includes("end") || message.type.includes("stop")) {
          setIsUserSpeaking(false);
        }
      }
    };

    const onSpeechStart = (data) => {
      console.log("🎤 SPEECH START EVENT:", JSON.stringify(data, null, 2));
      // Check if it's the assistant speaking
      if (data?.role === "assistant") {
        console.log("🤖 ASSISTANT SPEECH START (direct event)");
        setIsSpeaking(true);
        setIsUserSpeaking(false);
      } else if (data?.role === "user") {
        console.log("👤 USER SPEECH START (direct event)");
        setIsUserSpeaking(true);
        setIsSpeaking(false);
      } else {
        console.log("🎤 UNKNOWN SPEAKER - assuming assistant");
        // Fallback - assume it's assistant speaking if no role specified
        setIsSpeaking(true);
      }
    };

    const onSpeechEnd = (data) => {
      console.log("🎤 SPEECH END EVENT:", JSON.stringify(data, null, 2));
      if (data?.role === "assistant") {
        console.log("🤖 ASSISTANT SPEECH END (direct event)");
        setIsSpeaking(false);
      } else if (data?.role === "user") {
        console.log("👤 USER SPEECH END (direct event)");
        setIsUserSpeaking(false);
      } else {
        console.log("🎤 UNKNOWN SPEAKER END - turning off both");
        // Fallback - turn off both
        setIsSpeaking(false);
        setIsUserSpeaking(false);
      }
    };

    // Additional handlers for user-specific events
    const onUserSpeechStart = () => {
      console.log("👤 USER SPEECH START (dedicated event)");
      setIsUserSpeaking(true);
      setIsSpeaking(false);
    };

    const onUserSpeechEnd = () => {
      console.log("👤 USER SPEECH END (dedicated event)");
      setIsUserSpeaking(false);
    };

    const onAssistantSpeechStart = () => {
      console.log("🤖 ASSISTANT SPEECH START (dedicated event)");
      setIsSpeaking(true);
      setIsUserSpeaking(false);
    };

    const onAssistantSpeechEnd = () => {
      console.log("🤖 ASSISTANT SPEECH END (dedicated event)");
      setIsSpeaking(false);
    };

    // Handle transcript events to detect who's speaking
    const onTranscriptStart = (data) => {
      console.log("📝 TRANSCRIPT START:", JSON.stringify(data, null, 2));
      if (data?.role === "user") {
        console.log("👤 USER TRANSCRIPT START");
        setIsUserSpeaking(true);
        setIsSpeaking(false);
      } else if (data?.role === "assistant") {
        console.log("🤖 ASSISTANT TRANSCRIPT START");
        setIsSpeaking(true);
        setIsUserSpeaking(false);
      }
    };

    const onTranscriptEnd = (data) => {
      console.log("📝 TRANSCRIPT END:", JSON.stringify(data, null, 2));
      if (data?.role === "user") {
        console.log("👤 USER TRANSCRIPT END");
        setIsUserSpeaking(false);
      } else if (data?.role === "assistant") {
        console.log("🤖 ASSISTANT TRANSCRIPT END");
        setIsSpeaking(false);
      }
    };

    // Catch-all event listener to see what events are being fired
    const onAnyEvent = (eventName, data) => {
      console.log("🔍 ANY EVENT:", eventName, JSON.stringify(data, null, 2));
      
      // Try to detect user speech from any event
      if (eventName.includes("user") && eventName.includes("start")) {
        console.log("👤 DETECTED USER START from:", eventName);
        setIsUserSpeaking(true);
        setIsSpeaking(false);
      } else if (eventName.includes("user") && eventName.includes("end")) {
        console.log("👤 DETECTED USER END from:", eventName);
        setIsUserSpeaking(false);
      }
    };

    const onError = (error) => {
      console.error("VAPI Error:", error);
      setCallStatus(CALL_STATUS.INACTIVE);
      setIsSpeaking(false);
      setIsUserSpeaking(false);
    };

    // Register event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Also try alternative event names (different VAPI versions might use different names)
    vapi.on("callStart", onCallStart);
    vapi.on("callEnd", onCallEnd);
    vapi.on("speechStart", onSpeechStart);
    vapi.on("speechEnd", onSpeechEnd);

    // User-specific speech events
    vapi.on("user-speech-start", onUserSpeechStart);
    vapi.on("user-speech-end", onUserSpeechEnd);
    vapi.on("userSpeechStart", onUserSpeechStart);
    vapi.on("userSpeechEnd", onUserSpeechEnd);

    // Assistant-specific speech events
    vapi.on("assistant-speech-start", onAssistantSpeechStart);
    vapi.on("assistant-speech-end", onAssistantSpeechEnd);
    vapi.on("assistantSpeechStart", onAssistantSpeechStart);
    vapi.on("assistantSpeechEnd", onAssistantSpeechEnd);

    // Transcript events
    vapi.on("transcript-start", onTranscriptStart);
    vapi.on("transcript-end", onTranscriptEnd);
    vapi.on("transcriptStart", onTranscriptStart);
    vapi.on("transcriptEnd", onTranscriptEnd);

    // Additional possible event names
    vapi.on("user-start-speaking", onUserSpeechStart);
    vapi.on("user-stop-speaking", onUserSpeechEnd);
    vapi.on("assistant-start-speaking", onAssistantSpeechStart);
    vapi.on("assistant-stop-speaking", onAssistantSpeechEnd);

    return () => {
      // Clean up all event listeners
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      
      vapi.off("callStart", onCallStart);
      vapi.off("callEnd", onCallEnd);
      vapi.off("speechStart", onSpeechStart);
      vapi.off("speechEnd", onSpeechEnd);

      // Clean up additional event listeners
      vapi.off("user-speech-start", onUserSpeechStart);
      vapi.off("user-speech-end", onUserSpeechEnd);
      vapi.off("userSpeechStart", onUserSpeechStart);
      vapi.off("userSpeechEnd", onUserSpeechEnd);

      vapi.off("assistant-speech-start", onAssistantSpeechStart);
      vapi.off("assistant-speech-end", onAssistantSpeechEnd);
      vapi.off("assistantSpeechStart", onAssistantSpeechStart);
      vapi.off("assistantSpeechEnd", onAssistantSpeechEnd);

      vapi.off("transcript-start", onTranscriptStart);
      vapi.off("transcript-end", onTranscriptEnd);
      vapi.off("transcriptStart", onTranscriptStart);
      vapi.off("transcriptEnd", onTranscriptEnd);

      vapi.off("user-start-speaking", onUserSpeechStart);
      vapi.off("user-stop-speaking", onUserSpeechEnd);
      vapi.off("assistant-start-speaking", onAssistantSpeechStart);
      vapi.off("assistant-stop-speaking", onAssistantSpeechEnd);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CALL_STATUS.FINISHED) {
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, [callStatus, router]);

  const handleCall = async () => {
    try {
      setCallStatus(CALL_STATUS.CONNECTING);
      console.log("Starting call...");

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
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CALL_STATUS.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log("Ending call...");
      setCallStatus(CALL_STATUS.FINISHED);
      await vapi.stop();
    } catch (error) {
      console.error("Error ending call:", error);
      setCallStatus(CALL_STATUS.FINISHED);
    }
  };

  const latestMsg = messages[messages.length - 1]?.content;
  const isCallInactive = callStatus === CALL_STATUS.INACTIVE || callStatus === CALL_STATUS.FINISHED;

  return (
    <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-3 py-4">
        {/* Video Call Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* AI Interviewer Card */}
          <div className="group relative transition-all duration-500 transform">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F39F6] to-[#7C3AED] rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative h-[320px] bg-gradient-to-br from-[#DDDFFF] to-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="relative mb-4">
                  <div className={`flex items-center justify-center bg-[#4F39F6] rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-xl transition-transform duration-300 group-hover:scale-105 ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <MessageCircle
                      size={40}
                      className="sm:w-12 sm:h-12 text-[#DDDFFF]"
                    />
                  </div>
                  {isSpeaking && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-20"></div>
                      <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-10 animation-delay-150"></div>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  AI Interviewer
                </h3>
                {isSpeaking && (
                  <div className="mt-2 text-sm text-[#4F39F6] font-medium animate-pulse">
                    Speaking...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className="group relative transition-all duration-500 transform hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F39F6] to-[#7C3AED] rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative h-[320px] bg-gradient-to-br from-white to-[#DDDFFF] rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="relative mb-4">
                  <div className={`flex items-center justify-center bg-[#4F39F6] rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-xl transition-transform duration-300 group-hover:scale-105 ${isUserSpeaking ? 'animate-pulse' : ''}`}>
                    <User
                      size={40}
                      className="sm:w-12 sm:h-12 text-[#DDDFFF]"
                    />
                  </div>
                  {isUserSpeaking && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-20"></div>
                      <div className="absolute inset-0 rounded-full bg-[#4F39F6] animate-ping opacity-10 animation-delay-150"></div>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{userName}</h3>
                {isUserSpeaking && (
                  <div className="mt-2 text-sm text-[#4F39F6] font-medium animate-pulse">
                    Speaking...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {messages.length > 0 && (
          <div className="relative mb-8 transition-all duration-500 transform">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4">
                <p className="text-gray-800 text-base leading-relaxed animate-fadeIn">
                  {latestMsg}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center">
          {callStatus === CALL_STATUS.ACTIVE ? (
            <button
              className="group relative px-8 py-3 rounded-full font-medium text-base shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
              onClick={handleDisconnect}
            >
              <span className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-sm mr-2"></div>
                End Call
              </span>
              <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          ) : (
            <button
              className="group relative px-8 py-3 rounded-full font-medium text-base shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 bg-green-500 hover:bg-green-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCall}
              disabled={callStatus === CALL_STATUS.CONNECTING}
            >
              <span className="flex items-center">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent mr-2"></div>
                {callStatus === CALL_STATUS.CONNECTING ? "Connecting..." : "Start Call"}
              </span>
              <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}

export default Agent;