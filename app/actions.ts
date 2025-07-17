'use server';

import webpush from 'web-push';

// Ensure VAPID keys are present
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = 'mailto:a.eric.benni@gmail.com'; // This must be a valid mailto or URL

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  throw new Error('Missing VAPID keys in environment variables');
}

webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Shape required by `web-push`
interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let subscription: PushSubscriptionPayload | null = null;

export async function subscribeUser(sub: PushSubscriptionPayload) {
  subscription = sub;
  // In production, store it in a DB keyed by user
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
