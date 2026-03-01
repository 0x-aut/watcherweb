"use client";
import {
  CallingState, StreamCall,
  StreamVideo, StreamVideoClient,
  useCallStateHooks, Call,
  ParticipantView, type StreamVideoParticipant
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, PictureInPicture2, Video, VideoOff } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const apiKey = '3krh3rxttsru'
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Stream() {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("watcher_user_id")!
    const token = localStorage.getItem("watcher_token")!
    const callId = localStorage.getItem("watcher_call_id")!

    const _client = new StreamVideoClient({ apiKey, user: { id: userId }, token })
    const _call = _client.call('default', callId)

    _call.join({ create: true }).then(() => {
      fetch(`${backend_url}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_type: "default", call_id: callId }),
      }).then(res => res.json()).then(data => {
        localStorage.setItem("watcher_session_id", data.session_id)
      })
      setClient(_client)
      setCall(_call)
    })
  }, [])

  if (!client || !call) return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
      <span className="font-sans text-base tracking-[-0.05em] font-medium text-white">Loading</span>
    </div>
  )

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <UILayout call={call} />
      </StreamCall>
    </StreamVideo>
  )
}

export function UILayout({ call }: { call: Call }) {
  const { useCallCallingState, useRemoteParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-black">
        <span className="font-sans text-base tracking-[-0.05em] font-medium text-white">Loading</span>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <MyParticipantList participants={remoteParticipants} />
      <div className="absolute bottom-15 left-1/2 -translate-x-1/2 rounded-2xl">
        <ButtonLayout call={call} />
      </div>
    </div>
  )
}

export function ButtonLayout({ call }: { call: Call }) {
  const [stats, setStats] = useState({ score: 100, last_posture_ok: true, keypoints_visible: false });
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  const { camera, isMute: isCameraMute } = useCameraState();
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(`${backend_url}/posture/${call.id}/stats`);
        if (res.ok) setStats(await res.json());
      } catch {}
    }, 2000);
    return () => clearInterval(id);
  }, [call.id]);

  async function endVideoCall() {
    try {
      const sessionId = localStorage.getItem("watcher_session_id")
      await fetch(`${backend_url}/sessions/${sessionId}`, { method: "DELETE" });
      await call.leave()
      router.push("/")
    } catch (error) {
      console.log(`Error leaving call: ${error}`)
    }
  }

  return (
    <div className="flex gap-x-2.5 items-center">
      <Button size="lg" className="rounded-full cursor-pointer border border-green-300" variant="outline">
        <span className="font-sans text-base font-medium">{stats.score}</span>
      </Button>
      <div>
        {isCameraMute
          ? <Button size="icon-lg" className="rounded-full cursor-pointer" variant="default" onClick={() => camera.toggle()}><Video /></Button>
          : <Button size="icon-lg" className="rounded-full cursor-pointer" variant="destructive" onClick={() => camera.toggle()}><VideoOff /></Button>
        }
      </div>
      <div>
        {isMute
          ? <Button size="icon-lg" className="rounded-full cursor-pointer" variant="default" onClick={() => microphone.toggle()}><Mic /></Button>
          : <Button size="icon-lg" className="rounded-full cursor-pointer" variant="destructive" onClick={() => microphone.toggle()}><MicOff /></Button>
        }
      </div>
      <Button size="icon-lg" className="rounded-full cursor-pointer" variant="default"><PictureInPicture2 /></Button>
      <Button size="icon-lg" className="cursor-pointer rounded-[30px]" variant="destructive" onClick={endVideoCall}><PhoneOff /></Button>
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