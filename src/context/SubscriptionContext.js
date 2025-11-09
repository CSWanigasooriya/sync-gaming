import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Check if user document exists
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // User exists, get subscription
            const userData = userDocSnap.data();
            setSubscription(userData.subscription || getDefaultSubscription());
          } else {
            // First time user - create document with free tier
            const defaultSubscription = getDefaultSubscription();
            await setDoc(userDocRef, {
              email: currentUser.email,
              displayName: currentUser.displayName || '',
              avatar: currentUser.photoURL || '',
              country: 'SL',
              createdAt: new Date(),
              subscription: defaultSubscription,
              preferences: {
                language: 'en',
                themeMode: 'dark',
                adConsent: true,
                dataConsent: true,
                notifications: true
              }
            });
            setSubscription(defaultSubscription);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
          // Fallback to default subscription
          setSubscription(getDefaultSubscription());
        }
      } else {
        setUser(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, user }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}

function getDefaultSubscription() {
  return {
    tier: 'free',
    joinedAt: new Date(),
    features: {
      unlimitedPlay: true,
      leaderboards: true,
      achievements: true,
      tournaments: true,
      customization: 'limited',
      profileBadges: false,
      exclusiveGames: false,
      adFree: false
    },
    adWatchCount: 0,
    rewards: {
      points: 0,
      achievements: [],
      badges: [],
      cosmetics: []
    }
  };
}
