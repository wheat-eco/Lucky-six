"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep Label
import { Loader2, Share2, CheckCircle } from "lucide-react";
import ShareIcon from '@mui/icons-material/Share';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useToast } from "@/hooks/use-toast";
import { WaitlistData } from "@/lib/server/firestore"; // Import WaitlistData from the new server file
import { useCurrentAccount } from "@mysten/dapp-kit";

// Declare the grecaptcha variable
declare global {
  interface Window {
    grecaptcha: any;
  }
}


interface ShareStepProps {
    onCompleted: () => void;
    xUsername: string;
    setFormData: React.Dispatch<React.SetStateAction<{ xUsername: string; tweetUrl: string; }>>;
}

export function ShareStep({ onCompleted, xUsername }: ShareStepProps) {
  const [tweetUrl, setTweetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const account = useCurrentAccount();

  const tweetText = `Joining the @wheatchain_xyz waitlist! Get ready for a new era of decentralized strategy on #Sui.

#WheatChain #SuiGaming #P2E`;

  const handleShare = () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!tweetUrl.match(/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+(\?.*)?$/)) {
          setError("Please enter a valid X/Twitter post URL.");
          return;
      }
      if (!account) {
          setError("Wallet not connected. Please go back and connect.");
          return;
      }

      // Execute reCAPTCHA Enterprise
      let recaptchaToken = null;
      if (window.grecaptcha && window.grecaptcha.enterprise) {
 try {
          recaptchaToken = await window.grecaptcha.enterprise.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'waitlist_join' });
        } catch (e) {
          console.error("reCAPTCHA execution failed:", e);
          setError("Failed to verify reCAPTCHA. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      setError('');
      setIsSubmitting(true);

      const waitlistData: WaitlistData & { recaptchaToken: string | null } = {
          suiAddress: account.address,
          xUsername,
          tweetUrl,
          recaptchaToken,
      };

      // Call the new API route instead of the direct function
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waitlistData),
      });

      const result = await res.json();
      if (result.success) {
          // Only show toast on success
 toast({
 title: "Post Submitted!",
 description: "Your final step is complete.",
 variant: "default",
 });
          // Proceed to the next step only on success
          onCompleted();
      } else {
          setError(result.error ?? '');
      }
      setIsSubmitting(false);
  };
    
  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 text-left">
        <div className="space-y-3">
            <Label className="text-base md:text-lg flex items-center gap-2 font-semibold text-white">
                <span className="flex items-center justify-center bg-amber-400 text-black rounded-full h-6 w-6 text-sm flex-shrink-0">3</span>
                Share on X
            </Label>
            <p className="text-muted-foreground pl-8 text-sm md:text-base">
                Create a post on X with the following template and submit the URL.
            </p>
        </div>
        
        <div className="pl-8 space-y-4">
             <div className="p-3 md:p-4 rounded-md bg-black/30 border border-white/20 text-xs md:text-sm text-gray-300 italic">
                {tweetText.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <Button type="button" onClick={handleShare} variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black">
                <ShareIcon sx={{ mr: 1, fontSize: 16 }} /> Create Post
 </Button>
 </div>

        <div className="pl-8 space-y-2">
            <Label htmlFor="tweet-url">Your Post URL</Label>
            <Input 
                id="tweet-url"
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                placeholder="https://x.com/username/status/123..."
                required
                className="bg-background/50 border-white/20 focus:ring-amber-400"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting} size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm md:text-base">
                {isSubmitting ? <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} /> : <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: 16 }} />}
                Confirm & Finish
            </Button>
        </div>
    </form>
  );
}
