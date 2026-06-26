import { useState, useEffect } from 'react';
import type { Adventure } from '../types/adventure';
import { INITIAL_ADVENTURES } from '../types/adventure';
import { collection, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useAdventures(coupleId: string | null) {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId) { setLoading(false); return; }

    const ref = collection(db, 'couples', coupleId, 'adventures');
    const unsubscribe = onSnapshot(ref, async (snap: QuerySnapshot<DocumentData>) => {
      if (snap.empty) {
        for (const adv of INITIAL_ADVENTURES) {
          await setDoc(doc(ref, adv.id), adv);
        }
        setAdventures(INITIAL_ADVENTURES);
      } else {
        setAdventures(snap.docs.map((d: DocumentData) => d.data() as Adventure));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [coupleId]);

  async function addAdventure(data: Omit<Adventure, 'id' | 'status'>) {
    if (!coupleId) return;
    const id = data.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newAdv: Adventure = { ...data, id, status: 'locked' };
    await setDoc(doc(db, 'couples', coupleId, 'adventures', id), newAdv);
  }

  async function completeAdventure(id: string) {
    if (!coupleId) return;
    await updateDoc(doc(db, 'couples', coupleId, 'adventures', id), { status: 'completed' });
  }

  return { adventures, loading, addAdventure, completeAdventure };
}
