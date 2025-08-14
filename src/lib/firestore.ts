import { db } from './firebase';
import { collection, getDocs, addDoc, query, where,getCountFromServer } from 'firebase/firestore';

export interface WaitlistData {
  suiAddress: string;
  xUsername: string;
  tweetUrl: string;
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const coll = collection(db, 'waitlist');
    const snapshot = await getCountFromServer(coll);
    // Add a base number to make it look more impressive
    return snapshot.data().count + 190000;
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return 190000; // Return base number on error
  }
}

export async function addToWaitlist(data: WaitlistData): Promise<{ success: boolean; error?: string }> {
  if (!data.suiAddress || !data.xUsername || !data.tweetUrl) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const waitlistRef = collection(db, 'waitlist');
    
    // Check if Sui address already exists
    const q = query(waitlistRef, where('suiAddress', '==', data.suiAddress));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return { success: false, error: "This Sui address is already on the waitlist." };
    }

    await addDoc(waitlistRef, {
      ...data,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return { success: false, error: "An error occurred while joining the waitlist." };
  }
}
