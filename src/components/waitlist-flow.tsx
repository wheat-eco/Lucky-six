"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectWalletStep } from './waitlist-steps/connect-wallet-step';
import { SocialsStep } from './waitlist-steps/socials-step';
import { ShareStep } from './waitlist-steps/share-step';
import { ThankYouStep } from './waitlist-steps/thank-you-step';
import { Progress } from './ui/progress';

export type Step = "connect" | "socials" | "share" | "thanks";

const TOTAL_STEPS = 3;

export function WaitlistFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("connect");
  const [formData, setFormData] = useState({ xUsername: '', tweetUrl: '' });
  const account = useCurrentAccount();
  
  const stepNumber = {
    connect: 1,
    socials: 2,
    share: 3,
    thanks: 4
  };

  const nextStep = () => {
    switch (step) {
      case "connect":
        if (account) setStep("socials");
        break;
      case "socials":
        setStep("share");
        break;
      case "share":
        setStep("thanks");
        break;
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing the modal
      setTimeout(() => {
        setStep("connect");
        setFormData({ xUsername: '', tweetUrl: '' });
      }, 300);
    }
    setIsOpen(open);
  };
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary-foreground font-bold shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-1 text-lg px-8 py-6"
      >
        Join Waitlist
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-background/80 backdrop-blur-sm border-white/20 text-primary-foreground max-w-lg p-8">
            <DialogHeader>
                <DialogTitle className="text-3xl font-headline text-amber-300 mb-2">
                    {step !== 'thanks' ? "Join the Waitlist" : "Welcome Aboard!"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-base">
                   {step !== 'thanks' ? "Complete the following steps to secure your spot." : "You're officially on the waitlist. See you at launch!"}
                </DialogDescription>
            </DialogHeader>

            {step !== 'thanks' && (
                <div className="my-4">
                    <Progress value={(stepNumber[step] / TOTAL_STEPS) * 100} className="w-full h-2 bg-black/30" indicatorClassName="bg-amber-400" />
                    <p className="text-right text-xs text-muted-foreground mt-1">Step {stepNumber[step]} of {TOTAL_STEPS}</p>
                </div>
            )}
            
            <div className="mt-4">
                {step === "connect" && <ConnectWalletStep onConnected={nextStep} />}
                {step === "socials" && <SocialsStep onCompleted={nextStep} setFormData={setFormData} />}
                {step === "share" && <ShareStep onCompleted={nextStep} xUsername={formData.xUsername} setFormData={setFormData} />}
                {step === "thanks" && <ThankYouStep />}
            </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
