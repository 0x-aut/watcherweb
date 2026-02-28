"use client";
import {
  CallingState, StreamCall,
  StreamVideo, StreamVideoClient,
  useCall, useCallStateHooks,
  type User, StreamTheme,
  ParticipantView, type StreamVideoParticipant
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = "3krh3rxttsru";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZGVtby11c2VyLUlsOUUzT2hHIiwic3ViIjoidXNlci9kZW1vLXVzZXItSWw5RTNPaEciLCJhcGlLZXkiOiIza3JoM3J4dHRzcnUiLCJpYXQiOjE3NzIyNzE1MzEsImV4cCI6MTc3MjI3NTEzMX0.PYThZnA1iehLAHuEfzJvo2YLCAXx8QMszZ6TB2p7_SQ"; // This will be generated in the backend and passed here
const userId = 'demo-user-NoWFbucN'; // This will be generated too
const callId = 'demo-call-XrnP7Z-h'; // This will be generated

const user: User = { id: userId, name="Test" }
if (!apiKey) {
  throw new Error("apiKey is not found please add api key")
}
if (!token) {
  console.log(token)
  throw new Error("token is not found, please add token")
}

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', "demo-call-XrnP7Z-h");
call.join({ create: true })

export default function Stream() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <UILayout />
      </StreamCall>
    </StreamVideo>
  )
}

export function UILayout() {
  const call = useCall();
  
  const {
    useCallCallingState, useParticipantCount,
    useLocalParticipant, useRemoteParticipants
  } = useCallStateHooks();
  
  const localParticipant = useLocalParticipant();
  const callingState = useCallCallingState();
  // const participantCount = useParticipantCount();
  const remoteParticipants = useRemoteParticipants();
  
  if (callingState !== CallingState.JOINED) {
    return <div className="flex justify-center items-center w-screen h-screen bg-black">
      <span className="font-sans text-base tracking-[-0.05em] font-medium text-white">Loading</span>
    </div>;
  }
  
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <StreamTheme>
        <MyParticipantList participants={remoteParticipants} />
        {/*<MyFloatingLocalParticipant participant={localParticipant} />*/}
      </StreamTheme>
    </div>
    
  );
}

export function MyParticipantList({ participants }: { participants: StreamVideoParticipant[] }) {
  return (
    <div className="h-[90vh] w-[90vw] border border-black rounded-2xl">
      {participants.map(participant => (
        <ParticipantView key={participant.sessionId} participant={participant} />
      ))}
    </div>
  );
}

export function MyFloatingLocalParticipant({ participant }: { participant?: StreamVideoParticipant }) {
  if (!participant) {
    return <p>Error: no local participant</p>
  }
  
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      <ParticipantView participant={participant} />
    </div>
  )
}
