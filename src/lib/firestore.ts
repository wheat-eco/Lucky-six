import { db } from './firebase';
import { collection, getDocs, addDoc, query, where, getCountFromServer } from 'firebase/firestore';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

export interface WaitlistData {
  suiAddress: string;
  xUsername: string;
  tweetUrl: string;
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const coll = collection(db, 'waitlist');
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count + 190000;
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return 190000;
  }
}

export interface AddToWaitlistData extends WaitlistData {
  recaptchaToken: string | null;
}

export async function addToWaitlist(
  data: AddToWaitlistData
): Promise<{ success: boolean; error?: string }> {
  const { recaptchaToken, ...waitlistData } = data;

  if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.RECAPTCHA_SECRET_KEY) {
    console.error('Missing reCAPTCHA environment variables.');
    return { success: false, error: 'Server configuration error.' };
  }

  // reCAPTCHA verification
  if (!recaptchaToken) {
    return { success: false, error: 'reCAPTCHA token is missing.' };
  }

  try {
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(process.env.GOOGLE_CLOUD_PROJECT_ID);

    const [response] = await client.createAssessment({
      parent: projectPath,
      assessment: {
        event: {
          token: recaptchaToken,
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        },
      },
    });

    if (!response?.tokenProperties?.valid) {
      return { success: false, error: 'reCAPTCHA token is invalid.' };
    }

    if ((response?.riskAnalysis?.score ?? 0) < 0.5) {
      console.warn(`reCAPTCHA score too low: ${response?.riskAnalysis?.score}`);
      return { success: false, error: 'reCAPTCHA verification failed.' };
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return { success: false, error: 'Failed to verify reCAPTCHA.' };
  }

  // Field validation
  if (!data.suiAddress || !data.xUsername || !data.tweetUrl) {
    return { success: false, error: 'Missing required fields.' };
  }

  try {
    const waitlistRef = collection(db, 'waitlist');

    const checks = [
      { field: 'suiAddress', value: data.suiAddress, message: 'This Sui address is already on the waitlist.' },
      { field: 'xUsername', value: data.xUsername, message: 'This X username is already on the waitlist.' },
      { field: 'tweetUrl', value: data.tweetUrl, message: 'This tweet URL has already been used for the waitlist.' },
    ];

    for (const check of checks) {
      const q = query(waitlistRef, where(check.field, '==', check.value));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { success: false, error: check.message };
      }
    }

    await addDoc(waitlistRef, {
      ...waitlistData,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `An error occurred while joining the waitlist: ${errorMessage}` };
  }
}
