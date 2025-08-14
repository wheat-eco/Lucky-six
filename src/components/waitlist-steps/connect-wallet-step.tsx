
"use client";

import { useEffect, useState } from 'react';
import { useWallets, useConnectWallet, useCurrentAccount } from "@mysten/dapp-kit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from "@/components/ui/button"; // Assuming this is a local component, not MUI Button
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

function CustomWalletModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) {
  const wallets = useWallets();
  const { mutate: connect, isPending } = useConnectWallet({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/80 backdrop-blur-sm border-white/20 text-primary-foreground w-[95vw] max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-amber-300 text-xl md:text-2xl font-headline">Select a Wallet</DialogTitle>
        </DialogHeader>
        <div className="py-4">
            <ul className="space-y-3">
            {wallets.map((wallet) => (
                <li key={wallet.name}>
                <button
                    disabled={isPending}
                    className="w-full text-left rounded-lg p-3 md:p-4 bg-black/20 hover:bg-black/40 transition-colors flex items-center gap-4 disabled:opacity-50"
                    onClick={() => connect({ wallet })}
                >
                    <img src={wallet.icon} alt={wallet.name} className="w-7 h-7 md:w-8 md:h-8 rounded-full" />
                    <span className="font-bold text-base md:text-lg text-white">{wallet.name}</span>
                    {isPending && <CircularProgress size={20} className="ml-auto text-amber-300" />}
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
    <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 min-h-[250px] animate-in fade-in duration-500">
        <CustomWalletModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        {!account ? (
            <Card className="bg-transparent border-none shadow-none flex flex-col items-center">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-white font-headline">Connect Your Sui Wallet</CardTitle>
                    <CardDescription className="text-sm md:text-base text-muted-foreground">Your gateway to the WheatChain ecosystem starts here.</CardDescription>
                </CardHeader>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    size="lg" 
                    className="mt-4 w-full max-w-xs bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-primary-foreground font-bold shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-1 text-base md:text-lg px-6 py-5 md:px-8 md:py-6"
                >
                    Connect Wallet
                </Button>
            </Card>
        ) : (
             <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-500">
                <CheckCircleIcon sx={{ fontSize: { xs: 48, md: 64 } }} className="text-green-400" />
                <h3 className="text-xl md:text-2xl font-bold text-white font-headline">Wallet Connected!</h3>
                <p className="text-muted-foreground max-w-xs break-all text-sm md:text-base">
                    {account.address}
                </p>
            </div>
        )}
    </div>
  );
}
