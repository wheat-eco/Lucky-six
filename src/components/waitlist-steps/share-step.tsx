"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Share2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareStepProps {
    onCompleted: () => void;
    xUsername: string;
    setFormData: React.Dispatch<React.SetStateAction<{ xUsername: string; tweetUrl: string; }>>;
}

export function ShareStep({ onCompleted, xUsername, setFormData }: ShareStepProps) {
  const [tweetUrl, setTweetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const tweetText = `Joining the @wheatchain_xyz waitlist! Get ready for a new era of decentralized strategy on #Sui.

#WheatChain #SuiGaming #P2E`;

  const handleShare = () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(url, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!tweetUrl.match(/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+(\?.*)?$/)) {
          setError("Please enter a valid X/Twitter post URL.");
          return;
      }
      setError('');
      setIsSubmitting(true);

      setFormData(prev => ({ ...prev, tweetUrl }));

      // Simulate submission
      setTimeout(() => {
          setIsSubmitting(false);
          toast({
              title: "Post Submitted!",
              description: "Your final step is complete.",
              variant: "default",
          });
          onCompleted();
      }, 1500);
  };
    
  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left">
        <div className="space-y-3">
            <Label className="text-lg flex items-center gap-2 font-semibold text-white">
                <span className="flex items-center justify-center bg-amber-400 text-black rounded-full h-6 w-6 text-sm">3</span>
                Share on X
            </Label>
            <p className="text-muted-foreground pl-8">
                Create a post on X with the following template and submit the URL.
            </p>
        </div>
        
        <div className="pl-8 space-y-4">
             <div className="p-4 rounded-md bg-black/30 border border-white/20 text-sm text-gray-300 italic">
                {tweetText.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <Button type="button" onClick={handleShare} variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black">
                <Share2 className="mr-2 h-4 w-4" />
                Create Post
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
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-bold">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Confirm & Finish
            </Button>
        </div>
    </form>
  );
}
