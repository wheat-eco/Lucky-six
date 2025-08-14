import { db } from '../firebase'; // Keep firebase client setup here
import { collection, getDocs, addDoc, query, where, getCountFromServer } from 'firebase/firestore';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

export interface WaitlistData {
  suiAddress: string;
  xUsername: string;
  tweetUrl: string;
}

export interface AddToWaitlistData extends WaitlistData {
  recaptchaToken: string;
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const coll = collection(db, 'waitlist');
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count + 190000;
  } catch {
    return 190000;
  }
}

export async function addToWaitlistServer(data: AddToWaitlistData) {
  const { recaptchaToken, suiAddress, xUsername, tweetUrl } = data;

  if (!recaptchaToken) {
    return { success: false, error: 'Missing reCAPTCHA token.' };
  }

  if (!suiAddress || !xUsername || !tweetUrl) {
    return { success: false, error: 'Missing required fields.' };
  }

  if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.RECAPTCHA_SECRET_KEY) {
    return { success: false, error: 'Server configuration error.' };
  }

  try {
    const client = new RecaptchaEnterpriseServiceClient();
    const parent = client.projectPath(process.env.GOOGLE_CLOUD_PROJECT_ID);

    // Verify token
    const [response] = await client.createAssessment({
      parent,
      assessment: {
        event: {
          token: recaptchaToken,
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        },
      },
    });

    if (!response?.tokenProperties?.valid) {
      return { success: false, error: 'Invalid reCAPTCHA token.' };
    }

    if ((response?.riskAnalysis?.score ?? 0) < 0.5) {
      return { success: false, error: 'Low reCAPTCHA score.' };
    }

  } catch (err) {
    console.error('reCAPTCHA verification failed:', err);
    return { success: false, error: 'reCAPTCHA verification failed.' };
  }

  try {
    const waitlistRef = collection(db, 'waitlist');

    // Prevent duplicates
    for (const [field, value] of [
      ['suiAddress', suiAddress],
      ['xUsername', xUsername],
      ['tweetUrl', tweetUrl],
    ] as const) {
      const snap = await getDocs(query(waitlistRef, where(field, '==', value)));
      if (!snap.empty) {
        return { success: false, error: `${field} is already registered.` };
      }
    }

    await addDoc(waitlistRef, { suiAddress, xUsername, tweetUrl, createdAt: new Date() });

    return { success: true };

  } catch (err) {
    console.error('Error saving to waitlist:', err);
    return { success: false, error: 'Database error.' };
  }
}