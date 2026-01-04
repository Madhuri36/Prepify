import Agent from "./_components/Agent";
import { getUser } from "@/app/actions/auth";

const Page = async () => {
  // Server-side user fetch (SAFE)
  const { user } = await getUser();

  const userName =
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "Guest";

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create an Interview
      </h2>

      <Agent
        userName={userName}
        userId={user?.id}
        type="generate"
      />
    </div>
  );
};

export default Page;
