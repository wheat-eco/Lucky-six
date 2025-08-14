'use server';

import { db } from '@/lib/firebase-admin';

export async function addToWaitlist(data: { suiAddress: string, xUsername: string }) {
  if (!data.suiAddress || !data.xUsername) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const waitlistRef = db.collection('waitlist');
    
    // Check if Sui address already exists
    const existingSui = await waitlistRef.where('suiAddress', '==', data.suiAddress).get();
    if (!existingSui.isEmpty) {
      return { success: false, error: "This Sui address is already on the waitlist." };
    }

    // Check if X username already exists
    const existingX = await waitlistRef.where('xUsername', '==', data.xUsername).get();
    if (!existingX.isEmpty) {
      return { success: false, error: "This X username is already on the waitlist." };
    }

    await waitlistRef.add({
      suiAddress: data.suiAddress,
      xUsername: data.xUsername,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return { success: false, error: "An error occurred while joining the waitlist." };
  }
}
