"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // Import db from firebase
import { collection, onSnapshot } from 'firebase/firestore'; // Import collection and onSnapshot
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';

export function WaitlistCounter() {
  const [count, setCount] = useState(190000);

  useEffect(() => {
    const waitlistCollection = collection(db, 'waitlist');

    const unsubscribe = onSnapshot(waitlistCollection, (snapshot) => {
      // Add the base number to the actual count
      setCount(snapshot.size + 190000);
    });
    
    return () => unsubscribe(); // Unsubscribe from real-time updates on component cleanup
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
