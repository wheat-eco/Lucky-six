"use client";

import { useState, useEffect } from "react";
import { useWallets, useConnectWallet, useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, X, Send } from "lucide-react";
import { addToWaitlist } from "@/app/actions";
import Link from "next/link";

type Step = "connect" | "details" | "thanks";

function CustomWalletModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) {
  const wallets = useWallets();
  const { mutate: connect, isPending } = useConnectWallet({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/80 backdrop-blur-sm border-white/20 text-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-amber-300">Select Wallet</DialogTitle>
        </DialogHeader>
        <ul className="space-y-2">
          {wallets.map((wallet) => (
            <li key={wallet.name}>
              <button
                disabled={isPending}
                className="w-full text-left rounded-lg p-3 bg-black/20 hover:bg-black/40 transition-colors flex items-center gap-4 disabled:opacity-50"
                onClick={() => connect({ wallet })}
              >
                <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-full" />
                <span className="font-bold">{wallet.name}</span>
                {isPending && <Loader2 className="h-5 w-5 animate-spin ml-auto" />}
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}


export function Waitlist() {
  const currentAccount = useCurrentAccount();
  const [step, setStep] = useState<Step>("connect");
  const [xUsername, setXUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount || !xUsername) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await addToWaitlist({
        suiAddress: currentAccount.address,
        xUsername,
      });

      if (result.success) {
        setStep("thanks");
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount && step === 'connect') {
      setStep('details');
    }
    if (!currentAccount && step !== 'connect') {
      setStep('connect');
    }
  }, [currentAccount, step]);

  return (
    <>
      <CustomWalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <Card className="bg-black/20 border-white/10 shadow-lg text-primary-foreground">
        {step === "connect" && (
          <>
            <CardHeader>
              <CardTitle className="text-amber-300">Join the Waitlist</CardTitle>
              <CardDescription>Connect your Sui wallet to get started.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="!bg-gradient-to-br !from-amber-400 !to-amber-600 !hover:from-amber-500 !hover:to-amber-700 !text-primary-foreground !font-bold !shadow-lg !shadow-amber-500/30 !transition-all !hover:shadow-xl !hover:shadow-amber-500/40 !transform !hover:-translate-y-1"
              >
                Connect Wallet
              </Button>
              <p className="text-xs text-muted-foreground">Step 1 of 2</p>
            </CardContent>
          </>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-amber-300">Almost There!</CardTitle>
              <CardDescription>
                Follow us on our socials and provide your X username.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-6">
                <Link href="https://x.com/wheatchain_xyz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-300 transition-colors duration-300">
                  <X className="h-7 w-7" />
                  <span className="sr-only">X</span>
                </Link>
                <Link href="https://t.me/swhit_tgchat" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-300 transition-colors duration-300">
                  <Send className="h-7 w-7" />
                  <span className="sr-only">Telegram</span>
                </Link>
              </div>

              <div className="space-y-2">
                <Label htmlFor="x-username">X Username</Label>
                <Input
                  id="x-username"
                  placeholder="@your_username"
                  value={xUsername}
                  onChange={(e) => setXUsername(e.target.value)}
                  required
                  className="bg-background/50 border-white/20 focus:ring-amber-400"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary-foreground font-bold shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Join Now"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">Step 2 of 2</p>
            </CardContent>
          </form>
        )}

        {step === "thanks" && (
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-amber-300">Thank You!</h2>
              <p className="text-muted-foreground">You're on the waitlist! Follow our socials for the latest updates.</p>
              <div className="flex justify-center space-x-6 pt-2">
                <Link href="https://x.com/wheatchain_xyz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-300 transition-colors duration-300">
                  <X className="h-8 w-8" />
                  <span className="sr-only">X</span>
                </Link>
                <Link href="https://t.me/swhit_tgchat" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-300 transition-colors duration-300">
                  <Send className="h-8 w-8" />
                  <span className="sr-only">Telegram</span>
                </Link>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
}
