"use client";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  function toCallPage() {
    router.push('/call')
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <main className="flex flex-col gap-y-2 min-h-screen w-full justify-center items-center">
        <h1 className="font-sans tracking-[-0.05em] text-3xl font-semibold m-0">Watcher</h1>
        <span className="font-sans tracking-[-0.05em] text-base">Your posture is costing you. We fix that</span>
        <Button
          variant="default"
          className="rounded-full cursor-pointer"
          size="sm"
          onClick={toCallPage}
        >
          <span className="font-sans font-normal text-sm">Start session</span>
        </Button>
      </main>
    </div>
  );
}
