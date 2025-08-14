import { Countdown } from "@/components/countdown";
import { ParticleBackground } from "@/components/particle-background";
import { WaitlistFlow } from "@/components/waitlist-flow";
import { WaitlistCounter } from "@/components/waitlist-counter";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center text-primary-foreground">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 h-full w-full pt-20">
        <main className="flex flex-col items-center gap-6">
          <div
            className="flex flex-col items-center gap-4 text-center"
          >
            <h1 className="text-5xl md:text-8xl font-extrabold font-headline tracking-tighter text-amber-300 animate-in fade-in slide-in-from-bottom-12 duration-700">
              WheatChain
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-headline max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              The Game Begins Soon. Prepare for a new era of decentralized strategy.
            </p>
          </div>
          
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
             <Countdown />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
            <WaitlistCounter />
          </div>

          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-700 delay-600">
            <WaitlistFlow />
          </div>
        </main>
      </div>
    </div>
  );
}
