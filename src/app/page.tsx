import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { ParticleBackground } from "@/components/particle-background";
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col items-center text-primary-foreground">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col items-center justify-between text-center p-4 h-screen w-full">
        <div />
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

          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-600">
            <Button size="lg" asChild className="px-10 py-6 text-lg bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary-foreground font-bold shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-1">
              <Link href="#">
                <Rocket className="mr-2 h-6 w-6" />
                Join the Community
              </Link>
            </Button>
          </div>
        </main>
        
        <footer className="pb-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-800">
          <div className="flex space-x-6">
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-300 transition-colors duration-300">
              <XIcon className="h-7 w-7" />
              <span className="sr-only">X</span>
            </Link>
            <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-300 transition-colors duration-300">
              <TelegramIcon className="h-7 w-7" />
              <span className="sr-only">Telegram</span>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
