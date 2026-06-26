import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import {
  doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Couple {
  id: string;
  createdBy: string;
  members: string[];
  inviteCode: string;
  createdAt: number;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useCouple(user: User | null) {
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadCouple();
  }, [user?.uid]);

  async function loadCouple() {
    if (!user) return;
    const userSnap = await getDoc(doc(db, 'users', user.uid));
    const coupleId = userSnap.data()?.coupleId;
    if (coupleId) {
      const coupleSnap = await getDoc(doc(db, 'couples', coupleId));
      if (coupleSnap.exists()) {
        const data = coupleSnap.data();
        setCouple({ ...data, id: coupleSnap.id } as Couple);
      }
    }
    setLoading(false);
  }

  async function createCouple(): Promise<Couple> {
    if (!user) throw new Error('No user');
    const coupleId = `${user.uid.slice(0, 8)}-${Date.now()}`;
    const inviteCode = generateCode();
    const newCouple: Couple = {
      id: coupleId, createdBy: user.uid,
      members: [user.uid], inviteCode, createdAt: Date.now(),
    };
    await setDoc(doc(db, 'couples', coupleId), newCouple);
    await setDoc(doc(db, 'users', user.uid), {
      displayName: user.displayName, email: user.email,
      photoURL: user.photoURL, coupleId,
    }, { merge: true });
    setCouple(newCouple);
    return newCouple;
  }

  async function joinCouple(inviteCode: string): Promise<boolean> {
    if (!user) return false;
    const q = query(collection(db, 'couples'), where('inviteCode', '==', inviteCode.toUpperCase().trim()));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    const coupleDoc = snap.docs[0];
    const data = coupleDoc.data() as Couple;
    if (data.members.includes(user.uid)) {
      await setDoc(doc(db, 'users', user.uid), { coupleId: coupleDoc.id }, { merge: true });
      setCouple({ ...data, id: coupleDoc.id });
      return true;
    }
    if (data.members.length >= 2) return false;
    await updateDoc(doc(db, 'couples', coupleDoc.id), { members: arrayUnion(user.uid) });
    await setDoc(doc(db, 'users', user.uid), {
      displayName: user.displayName, email: user.email,
      photoURL: user.photoURL, coupleId: coupleDoc.id,
    }, { merge: true });
    setCouple({ ...data, id: coupleDoc.id, members: [...data.members, user.uid] });
    return true;
  }

  return { couple, loading, createCouple, joinCouple, reload: loadCouple };
}
