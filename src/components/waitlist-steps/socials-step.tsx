"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { X as XIcon, Send } from 'lucide-react';
import Link from 'next/link';

interface SocialsStepProps {
  onCompleted: () => void;
  setFormData: React.Dispatch<React.SetStateAction<{ xUsername: string; tweetUrl: string; }>>;
}

type VerificationStatus = 'idle' | 'verifying' | 'verified';

export function SocialsStep({ onCompleted, setFormData }: SocialsStepProps) {
  const [xUsername, setXUsername] = useState('');
  const [xStatus, setXStatus] = useState<VerificationStatus>('idle');
  const [tgStatus, setTgStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState('');

  const handleVerification = (social: 'x' | 'tg') => {
    const setStatus = social === 'x' ? setXStatus : setTgStatus;
    setStatus('verifying');
    setTimeout(() => {
      setStatus('verified');
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xUsername.startsWith('@')) {
        setError('X username must start with @');
        return;
    }
    if(xUsername.length < 3) {
        setError('Please enter a valid X username.');
        return;
    }
    setError('');
    setFormData(prev => ({ ...prev, xUsername }));
    onCompleted();
  };

  const allVerified = xStatus === 'verified' && tgStatus === 'verified';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 text-left">
      <div className="space-y-3">
        <Label className="text-base md:text-lg flex items-center gap-2 font-semibold text-white">
            <span className="flex items-center justify-center bg-amber-400 text-black rounded-full h-6 w-6 text-sm flex-shrink-0">1</span>
            Follow us on X
        </Label>
        <p className="text-muted-foreground pl-8 text-sm md:text-base">
            Stay up to date with the latest announcements.
        </p>
        <div className="pl-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Link href="https://x.com/wheatchain_xyz" target="_blank" onClick={() => handleVerification('x')} className="flex-shrink-0">
                <Button type="button" variant="outline" className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black">
                    <XIcon className="mr-2 h-4 w-4" />
                    Follow @wheatchain_xyz
                </Button>
            </Link>
            {xStatus === 'verifying' && <div className="flex items-center gap-2 text-sm text-amber-300"><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</div>}
            {xStatus === 'verified' && <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle className="h-4 w-4" /> Done!</div>}
        </div>
        <div className="pl-8 space-y-2 pt-2">
            <Label htmlFor="x-username" className="text-sm md:text-base">Your X Username</Label>
            <Input
                id="x-username"
                placeholder="@your_handle"
                value={xUsername}
                onChange={(e) => setXUsername(e.target.value)}
                required
                className="bg-background/50 border-white/20 focus:ring-amber-400 max-w-xs"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label className="text-base md:text-lg flex items-center gap-2 font-semibold text-white">
            <span className="flex items-center justify-center bg-amber-400 text-black rounded-full h-6 w-6 text-sm flex-shrink-0">2</span>
            Join our Telegram
        </Label>
         <p className="text-muted-foreground pl-8 text-sm md:text-base">
            Become part of the community and chat with the team.
        </p>
        <div className="pl-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
             <Link href="https://t.me/swhit_tgchat" target="_blank" onClick={() => handleVerification('tg')} className="flex-shrink-0">
                <Button type="button" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <Send className="mr-2 h-4 w-4" />
                    Join Community
                </Button>
            </Link>
            {tgStatus === 'verifying' && <div className="flex items-center gap-2 text-sm text-amber-300"><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</div>}
            {tgStatus === 'verified' && <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle className="h-4 w-4" /> Done!</div>}
        </div>
      </div>

      <div className="flex justify-end pt-2 md:pt-4">
        <Button type="submit" disabled={!allVerified || !xUsername} size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm md:text-base">
            Next Step <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
