"use client";

import { CheckCircle, Twitter, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function ThankYouStep() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 min-h-[300px] space-y-6 animate-in fade-in duration-700">
        <CheckCircle className="h-20 w-20 text-green-400" />
        <div className="space-y-2">
            <h3 className="text-3xl font-bold font-headline text-white">You're All Set!</h3>
            <p className="text-muted-foreground text-lg max-w-sm">
                Thank you for joining the WheatChain waitlist. Keep an eye on our socials for announcements!
            </p>
        </div>
        <div className="flex justify-center space-x-6 pt-4">
            <Link href="https://x.com/wheatchain_xyz" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black">
                    <Twitter className="mr-2 h-5 w-5" />
                    X / Twitter
                </Button>
            </Link>
            <Link href="https://t.me/swhit_tgchat" target="_blank" rel="noopener noreferrer">
                 <Button variant="outline" size="lg" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <Send className="mr-2 h-5 w-5" />
                    Telegram
                </Button>
            </Link>
        </div>
    </div>
  );
}
