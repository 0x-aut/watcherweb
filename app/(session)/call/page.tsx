"use client";
import {
  CallingState, StreamCall,
  StreamVideo, StreamVideoClient,
  useCall, useCallStateHooks,
  type User, StreamTheme,
  ParticipantView, type StreamVideoParticipant
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, PictureInPicture2, Video, VideoOff } from 'lucide-react';

import { useRouter } from "next/navigation";




const apiKey = '3krh3rxttsru'
const userId = 'demo-user-PUcymDzl'
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZGVtby11c2VyLVBVY3ltRHpsIiwic3ViIjoidXNlci9kZW1vLXVzZXItUFVjeW1EemwiLCJhcGlLZXkiOiIza3JoM3J4dHRzcnUiLCJpYXQiOjE3NzIyOTAwNjcsImV4cCI6MTc3MjI5MzY2N30.6Q0So50LuIcQHimdxvrYBvaql6U0rlZpGYgnVa3bQJ0'

const user: User = { id: userId }
const client = new StreamVideoClient({ apiKey, user, token })
const call = client.call('default', 'demo-call-lLh3nCHl')
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
  // const call = useCall();
  
  const {
    useCallCallingState, useParticipantCount,
    useLocalParticipant, useRemoteParticipants
  } = useCallStateHooks();
  
  // const localParticipant = useLocalParticipant();
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
      <div className="absolute bottom-15 left-1/2 -translate-x-1/2 rounded-2xl">
        <ButtonLayout />
      </div>
    </div>
    
  );
}

export function ButtonLayout() {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  const { camera, isMute: isCameraMute } = useCameraState();
  
  const router = useRouter();
  
  async function microphoneToggle() {
    await microphone.toggle()
  }
  
  async function cameraToggle() {
    await camera.toggle()
  }
  
  async function endCall() {
    try {
      await call.endCall()
      router.push("/")
    } catch (error) {
      console.log(`An error occurred: ${error}`)
      console.log(`Leaving call instead`)
      await call.leave()
      router.push("/")
    }
  }
  
  return (
    <div className="flex gap-x-2.5 items-center">
      <Button size="lg" className="rounded-full cursor-pointer border border-green-300" variant="outline">
        <span className="font-sans text-base font-medium">Good</span>
      </Button>
      <div>
        {isCameraMute ? <Button size="icon-lg" className="rounded-full cursor-pointer" variant="default" onClick={cameraToggle}>
          <Video />
        </Button>
        :
        <Button size="icon-lg" className="rounded-full cursor-pointer" variant="destructive" onClick={cameraToggle}>
          <VideoOff />
        </Button>}
      </div>
      <div>
        {isMute ? <Button size="icon-lg" className="rounded-full cursor-pointer" variant="default" onClick={microphoneToggle}>
          <Mic />
        </Button>
        :
        <Button size="icon-lg" className="rounded-full cursor-pointer" variant="destructive" onClick={microphoneToggle}>
          <MicOff />
        </Button>}
      </div>
      <Button size="icon-lg" className="rounded-full cursor-pointer" variant="default">
        <PictureInPicture2 />
      </Button>
      <Button size="icon-lg" className="cursor-pointer rounded-[30px]" variant="destructive" aria-label="End Video call">
        <PhoneOff />
      </Button>
    </div>
  )
}

export function MyParticipantList({ participants }: { participants: StreamVideoParticipant[] }) {
  return (
    <div className="h-[90vh] w-[90vw] border border-black rounded-2xl">
      {participants.slice(0, 1).map(participant => (
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
