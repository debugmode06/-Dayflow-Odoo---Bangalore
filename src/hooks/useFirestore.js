import { useState, useEffect } from 'react';
import { subscribeToCollection } from '@/lib/firebase/firestore';

export const useFirestoreCollection = (collectionName, constraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection(collectionName, constraints, (docs, err) => {
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        setData(docs);
        setError(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
};

export default useFirestoreCollection;
