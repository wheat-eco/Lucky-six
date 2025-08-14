'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link'; // Keep Link from next
import XIcon from '@mui/icons-material/X'; // Correct import for X icon
import TelegramIcon from '@mui/icons-material/Telegram';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from MUI
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Import CheckCircleOutlineIcon from MUI

interface SocialsStepProps {
  onCompleted: () => void;
  setFormData: React.Dispatch<React.SetStateAction<{ xUsername: string; tweetUrl: string }>>;
}

type VerificationStatus = 'idle' | 'verifying' | 'verified';

export function SocialsStep({ onCompleted, setFormData }: SocialsStepProps) {
  const [xUsername, setXUsername] = useState('');
  const [xStatus, setXStatus] = useState<VerificationStatus>('idle');
  const [tgStatus, setTgStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState('');
  const [xUsernameError, setXUsernameError] = useState(''); // Dedicated state for username validation error

  const handleVerification = (social: 'x' | 'tg') => {
    const setStatus = social === 'x' ? setXStatus : setTgStatus;
    setStatus('verifying');
    setTimeout(() => {
      setStatus('verified');
    }, 2000);
  };

  // Real-time username validation
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setXUsername(value);
    if (!value.startsWith('@')) {
      setXUsernameError('X username must start with @');
    } else if (value.length < 3) {
      setXUsernameError('Username must be at least 3 characters long.');
    } else {
      setXUsernameError(''); // Clear error if valid
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormData(prev => ({ ...prev, xUsername }));
    onCompleted();
  };

  const allVerified = xStatus === 'verified' && tgStatus === 'verified';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 text-left">
      {/* X Follow Section */}
      <div className="space-y-3">
        <Label className="text-base md:text-lg flex items-center gap-2 font-semibold text-white">
          <span className="flex items-center justify-center bg-amber-400 text-black rounded-full h-6 w-6 text-sm">1</span>
          Follow us on X
        </Label>
        <p className="text-muted-foreground pl-8 text-sm md:text-base">
          Stay up to date with the latest announcements.
        </p>
        <div className="pl-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Link
            href="https://x.com/wheatchain_xyz"
            target="_blank"
            onClick={() => handleVerification('x')}
            className="flex-shrink-0"
          >
            <Button
              type="button"
              variant="outline"
              className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black"
            >
              <XIcon className="mr-2 h-4 w-4" />
              Follow @wheatchain_xyz
            </Button>
          </Link>
          {/* Use MUI icons for verification status */}
          {xStatus === 'verifying' && (
            <div className="flex items-center gap-2 text-sm text-amber-300">
              <CircularProgress size={16} color="inherit" /> Verifying...
            </div>
          )}
          {xStatus === 'verified' && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> Done!
            </div>
          )}
          {/* Optional: Show a hint if not yet verified */}
          {xStatus === 'idle' && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               {/* You could add a hint icon here if desired */}
               Click the button after following.
             </div>
          )}

        </div>
        <div className="pl-8 space-y-2 pt-2">
          <Label htmlFor="x-username" className="text-sm md:text-base text-white">
            Your X Username
          </Label>
          <Input
            id="x-username"
            placeholder="@your_handle"
            value={xUsername} // Controlled input
            onChange={handleUsernameChange} // Use the new handler for validation
            required
            className="bg-background/50 border-white/20 focus:ring-amber-400 max-w-xs"
          />
          {/* Display username specific validation error */}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>

      {/* Telegram Join Section */}
      <div className="space-y-3">
        <Label className="text-base md:text-lg flex items-center gap-2 font-semibold text-white">
          <span className="flex items-center justify-center bg-amber-400 text-black rounded-full h-6 w-6 text-sm">2</span>
          Join our Telegram
        </Label>
        <p className="text-muted-foreground pl-8 text-sm md:text-base">
          Become part of the community and chat with the team.
        </p>
        <div className="pl-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Link
            href="https://t.me/swhit_tgchat"
            target="_blank"
            onClick={() => handleVerification('tg')}
            className="flex-shrink-0"
          >
            <Button
              type="button"
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              <TelegramIcon className="mr-2 h-4 w-4" />
              Join Community
            </Button>
          </Link>
          {tgStatus === 'verifying' && (
            // Use MUI icons for verification status
            <div className="flex items-center gap-2 text-sm text-amber-300">
              <CircularProgress size={16} color="inherit" /> Verifying...
            </div>
          )}
          {tgStatus === 'verified' && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> Done!
            </div>
          )}
           {/* Optional: Show a hint if not yet verified */}
          {tgStatus === 'idle' && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               {/* You could add a hint icon here if desired */}
               Click the button after joining.
             </div>
          )}
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end pt-2 md:pt-4">
        <Button
          type="submit" // Still a submit button to trigger form submission
          disabled={!allVerified || !!xUsernameError || xUsername.length < 3} // Disable if not all verified OR there's a username error OR username is too short
          size="lg"
          className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm md:text-base"
        >
          Next Step <ArrowForwardIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
