import { MessageSquarePlus } from "lucide-react";

const NoMessages = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <MessageSquarePlus className="size-8 text-base-content opacity-40" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Messages yet</h3>

      <p className="text-base-content opacity-70 max-w-md">
        {user?.fullName === "Gopuram"
          ? `Start a convo in Gopuram`
          : `Start a convo between you and ${user?.fullName}`}
      </p>
    </div>
  );
};

export default NoMessages;
