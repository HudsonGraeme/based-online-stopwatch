import localforage from "localforage";
import { useEffect, useRef, useState } from "react";

export const usePersisted = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const hasLoaded = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await localforage.getItem<T>(key);
        if (isMounted.current) {
          setValue(stored ?? initialValue);
          hasLoaded.current = true;
        }
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        if (isMounted.current) {
          hasLoaded.current = true;
        }
      }
    };
    loadValue();
  }, [key, initialValue]);

  useEffect(() => {
    if (!hasLoaded.current) return;

    const saveValue = async () => {
      try {
        await localforage.setItem(key, value);
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
      }
    };
    saveValue();
  }, [key, value]);

  return [value, setValue] as const;
};
