"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "random-stuff-favorites";
const SYNC_EVENT = "random-stuff-favorites-sync";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const favoritesRef = useRef<string[]>(favorites);

    useEffect(() => {
        favoritesRef.current = favorites;
    }, [favorites]);

    // Load favorites from localStorage on mount and listen for sync events
    useEffect(() => {
        const loadFavorites = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } catch (error) {
                console.error("Failed to load favorites:", error);
            }
            setIsLoaded(true);
        };

        loadFavorites();

        // Listen for updates from other browser tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    setFavorites(JSON.parse(e.newValue));
                } catch {
                    // Ignore parse errors
                }
            }
        };

        // Listen for updates from other components within the same tab
        const handleCustomSync = (e: Event) => {
            const customEvent = e as CustomEvent<string[]>;
            if (Array.isArray(customEvent.detail)) {
                setFavorites((prev) => {
                    if (
                        prev.length === customEvent.detail.length &&
                        prev.every((v, i) => v === customEvent.detail[i])
                    ) {
                        return prev;
                    }
                    return customEvent.detail;
                });
            }
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener(SYNC_EVENT, handleCustomSync);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener(SYNC_EVENT, handleCustomSync);
        };
    }, []);

    const updateAndPersist = useCallback(
        (updater: (current: string[]) => string[]) => {
            const next = updater(favoritesRef.current);
            favoritesRef.current = next;
            setFavorites(next);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                window.dispatchEvent(
                    new CustomEvent(SYNC_EVENT, { detail: next })
                );
            } catch (error) {
                console.error("Failed to save favorites:", error);
            }
        },
        []
    );

    const addFavorite = useCallback(
        (id: string) => {
            updateAndPersist((prev) => {
                if (prev.includes(id)) return prev;
                return [...prev, id];
            });
        },
        [updateAndPersist]
    );

    const removeFavorite = useCallback(
        (id: string) => {
            updateAndPersist((prev) => prev.filter((fav) => fav !== id));
        },
        [updateAndPersist]
    );

    const removeFavorites = useCallback(
        (ids: string[]) => {
            updateAndPersist((prev) => prev.filter((fav) => !ids.includes(fav)));
        },
        [updateAndPersist]
    );

    const toggleFavorite = useCallback(
        (id: string) => {
            updateAndPersist((prev) => {
                if (prev.includes(id)) {
                    return prev.filter((fav) => fav !== id);
                }
                return [...prev, id];
            });
        },
        [updateAndPersist]
    );

    const clearFavorites = useCallback(() => {
        updateAndPersist(() => []);
    }, [updateAndPersist]);

    const isFavorite = useCallback(
        (id: string) => favorites.includes(id),
        [favorites]
    );

    return {
        favorites,
        isLoaded,
        addFavorite,
        removeFavorite,
        removeFavorites,
        toggleFavorite,
        clearFavorites,
        isFavorite,
    };
}

