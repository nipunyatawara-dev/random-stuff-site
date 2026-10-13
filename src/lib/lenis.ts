import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis) {
    lenisInstance = instance;
}

export function clearLenisInstance(instance?: Lenis) {
    if (!instance || lenisInstance === instance) {
        lenisInstance = null;
    }
}

export function stopLenis() {
    lenisInstance?.stop();
}

export function startLenis() {
    lenisInstance?.start();
}

export function scrollToY(top: number, options: { immediate?: boolean } = {}) {
    const { immediate = false } = options;

    if (lenisInstance) {
        lenisInstance.scrollTo(top, { immediate });
        return;
    }

    if (typeof window !== "undefined") {
        window.scrollTo({
            top,
            behavior: immediate ? "auto" : "smooth",
        });
    }
}
