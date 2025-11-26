import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase';
import { Technique } from '../types';
import { TECHNIQUES as LOCAL_TECHNIQUES } from '../constants';

export const useTechniques = () => {
  const [techniques, setTechniques] = useState<Technique[]>(LOCAL_TECHNIQUES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'techniques'));
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => d.data() as Technique);
          setTechniques(data);
        }
        // If Firestore is empty, keep LOCAL_TECHNIQUES as fallback
      } catch (err) {
        console.warn('Failed to fetch techniques from Firestore, using local fallback:', err);
        setError('Using local data');
      } finally {
        setLoading(false);
      }
    };
    fetchTechniques();
  }, []);

  const saveTechnique = async (technique: Technique) => {
    const docRef = doc(db, 'techniques', technique.id);
    await setDoc(docRef, technique, { merge: true });
    setTechniques((prev) => {
      const idx = prev.findIndex((t) => t.id === technique.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = technique;
        return updated;
      }
      return [...prev, technique];
    });
  };

  const removeTechnique = async (id: string) => {
    await deleteDoc(doc(db, 'techniques', id));
    setTechniques((prev) => prev.filter((t) => t.id !== id));
  };

  return { techniques, loading, error, saveTechnique, removeTechnique };
};

