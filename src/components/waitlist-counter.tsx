"use client";

import { useEffect, useState } from 'react';
import { getWaitlistCount } from '@/lib/firestore';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';

export function WaitlistCounter() {
  const [count, setCount] = useState(190000);

  useEffect(() => {
    const fetchCount = async () => {
      const initialCount = await getWaitlistCount();
      setCount(initialCount);
    };
    fetchCount();

    // Fake real-time updates for visual effect
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + Math.floor(Math.random() * 3) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 text-amber-300 font-headline text-base md:text-xl font-bold tracking-wider">
        <RocketLaunchOutlinedIcon sx={{ fontSize: '1.25rem', '@media (min-width: 768px)': { fontSize: '1.5rem' } }} />
        <span className="text-base md:text-xl font-bold tracking-wider">
            {new Intl.NumberFormat('en-US').format(count)}+ Wallets Joined
        </span>
    </div>
  );
}
