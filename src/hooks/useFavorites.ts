"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const STORAGE_KEY = "random-stuff-favorites";
const SYNC_EVENT = "random-stuff-favorites-sync";

function parseStoredFavorites(value: string | null): string[] {
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed)
        ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
        : [];
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const favoritesRef = useRef<string[]>(favorites);
    const favoriteIds = useMemo(() => new Set(favorites), [favorites]);

    useEffect(() => {
        favoritesRef.current = favorites;
    }, [favorites]);

    // Load favorites from localStorage on mount and listen for sync events
    useEffect(() => {
        const loadFavorites = () => {
            try {
                const stored = parseStoredFavorites(localStorage.getItem(STORAGE_KEY));
                favoritesRef.current = stored;
                setFavorites(stored);
            } catch (error) {
                console.error("Failed to load favorites:", error);
            }
            setIsLoaded(true);
        };

        loadFavorites();

        // Listen for updates from other browser tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY || e.key === null) {
                try {
                    const next = parseStoredFavorites(e.newValue);
                    favoritesRef.current = next;
                    setFavorites(next);
                } catch {
                    // Ignore parse errors
                }
            }
        };

        // Listen for updates from other components within the same tab
        const handleCustomSync = (e: Event) => {
            const customEvent = e as CustomEvent<string[]>;
            if (Array.isArray(customEvent.detail)) {
                favoritesRef.current = customEvent.detail;
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
            if (next === favoritesRef.current) return;
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

    // Import a collection with one storage write and one synchronization event.
    const addFavorites = useCallback(
        (ids: string[]) => {
            updateAndPersist((prev) => [...new Set([...prev, ...ids])]);
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
            const removed = new Set(ids);
            updateAndPersist((prev) => prev.filter((fav) => !removed.has(fav)));
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
        (id: string) => favoriteIds.has(id),
        [favoriteIds]
    );

    return {
        favorites,
        isLoaded,
        addFavorite,
        addFavorites,
        removeFavorite,
        removeFavorites,
        toggleFavorite,
        clearFavorites,
        isFavorite,
    };
}

