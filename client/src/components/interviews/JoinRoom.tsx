import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

type JoinRoomProps = {
  onJoin: (channel: string, token: string) => void;
  isError: boolean;
  setIsError: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
};

const JoinRoom = ({
  onJoin,
  isError,
  setIsError,
  isLoading,
}: JoinRoomProps) => {
  const [channel, setChannel] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const isDisabled = useMemo(() => !channel || !token, [channel, token]);

  return (
    <div className="grid gap-2">
      <div className="flex gap-4 justify-between">
        <label htmlFor="channel-input" className="content-center">
          Room
        </label>
        <input
          id="channel-input"
          onChange={(e) => {
            setChannel(e.target.value);
            setIsError(false);
          }}
          placeholder="Enter channel"
          value={channel}
          className="p-2 border rounded"
        />
      </div>

      <div className="flex gap-4 justify-between">
        <label htmlFor="token-input" className="content-center">
          Token
        </label>
        <input
          id="token-input"
          onChange={(e) => {
            setToken(e.target.value);
            setIsError(false);
          }}
          placeholder="Enter token"
          value={token}
          className="p-2 border rounded"
        />
      </div>
      {isError && <span className="text-red-600">Invalid room or token</span>}
      <button
        className="bg-blue-500 disabled:bg-gray-100 disabled:text-black text-white p-2 rounded gap-2 flex justify-center"
        disabled={isDisabled || isError}
        onClick={() => onJoin(channel, token)}
      >
        Join Room
        {isLoading && <LoaderCircle className="animate-spin text-white" />}
      </button>
    </div>
  );
};

export default JoinRoom;
