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
          <DialogTitle className="text-amber-300">Select a Wallet</DialogTitle>
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
    <div className="flex flex-col items-center justify-center text-center p-4 min-h-[200px]">
        <CustomWalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        {!account ? (
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Connect Your Sui Wallet</CardTitle>
                    <CardDescription>Your gateway to the WheatChain ecosystem starts here.</CardDescription>
                </CardHeader>
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-bold">
                    Connect Wallet
                </Button>
            </Card>
        ) : (
             <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-500">
                <CheckCircle className="h-16 w-16 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Wallet Connected!</h3>
                <p className="text-muted-foreground max-w-xs break-all">
                    {account.address}
                </p>
            </div>
        )}
    </div>
  );
}
