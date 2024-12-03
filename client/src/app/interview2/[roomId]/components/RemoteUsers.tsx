import { RemoteUser, useRemoteUsers } from "agora-rtc-react";

const RemoteUsers = () => {
  // Get all the remote users
  const remoteUsers = useRemoteUsers();


  console.log(remoteUsers)
  // Get the audio/video to render for each remote user
  return (
    <div className="flex h-[25vh] gap-1  justify-between border-2 items-center p-2">
      {remoteUsers.map((user) => (
        <div className="aspect-video h-full overflow-hidden rounded-lg flex items-center justify-center" key={user.uid}>
          <RemoteUser user={user}>
            
          </RemoteUser>
        </div>
      ))}
    </div>



  );
};

export default RemoteUsers;
