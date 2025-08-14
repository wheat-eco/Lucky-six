
"use client";

import { useEffect, useState } from 'react';
import { useWallets, useConnectWallet, useCurrentAccount } from "@mysten/dapp-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

function CustomWalletModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) {
  const wallets = useWallets();
  const { mutate: connect, isPending } = useConnectWallet({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/80 backdrop-blur-sm border-white/20 text-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-amber-300 text-2xl font-headline">Select a Wallet</DialogTitle>
        </DialogHeader>
        <div className="py-4">
            <ul className="space-y-3">
            {wallets.map((wallet) => (
                <li key={wallet.name}>
                <button
                    disabled={isPending}
                    className="w-full text-left rounded-lg p-4 bg-black/20 hover:bg-black/40 transition-colors flex items-center gap-4 disabled:opacity-50"
                    onClick={() => connect({ wallet })}
                >
                    <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-lg text-white">{wallet.name}</span>
                    {isPending && <Loader2 className="h-5 w-5 animate-spin ml-auto text-amber-300" />}
                </button>
                </li>
            ))}
            </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConnectWalletStep({ onConnected }: { onConnected: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useCurrentAccount();
  
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        onConnected();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [account, onConnected]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 min-h-[250px] animate-in fade-in duration-500">
        <CustomWalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        {!account ? (
            <Card className="bg-transparent border-none shadow-none flex flex-col items-center">
                <CardHeader>
                    <CardTitle className="text-2xl text-white font-headline">Connect Your Sui Wallet</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">Your gateway to the WheatChain ecosystem starts here.</CardDescription>
                </CardHeader>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    size="lg" 
                    className="mt-4 w-64 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary-foreground font-bold shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-1 text-lg px-8 py-6"
                >
                    Connect Wallet
                </Button>
            </Card>
        ) : (
             <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-500">
                <CheckCircle className="h-16 w-16 text-green-400" />
                <h3 className="text-2xl font-bold text-white font-headline">Wallet Connected!</h3>
                <p className="text-muted-foreground max-w-xs break-all">
                    {account.address}
                </p>
            </div>
        )}
    </div>
  );
}
