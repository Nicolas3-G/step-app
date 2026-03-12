import { app, db } from './firebase';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInAnonymously,
  User,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

export const auth =
  getAuth.apps && getAuth.apps.length
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

async function ensureTempUserDoc(user: User): Promise<void> {
  const ref = doc(db, 'tempUser', user.uid);
  await setDoc(
    ref,
    {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      dateCreated: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function ensureUserContentDoc(user: User): Promise<void> {
  const ref = doc(db, 'userContent', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      likedQuotes: [],
      reflections: [],
      customQuotes: [],
      dateCreated: serverTimestamp(),
      dateModified: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });
    return;
  }

  await updateDoc(ref, {
    dateModified: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  });
}

export async function signInAnonymouslyIfNeeded(): Promise<User> {
  if (auth.currentUser) {
    await ensureTempUserDoc(auth.currentUser);
    await ensureUserContentDoc(auth.currentUser);
    return auth.currentUser;
  }

  const credential = await signInAnonymously(auth);
  await ensureTempUserDoc(credential.user);
   await ensureUserContentDoc(credential.user);
  return credential.user;
}

export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

