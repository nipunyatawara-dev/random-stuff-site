import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let scrollLocks = 0;
let previousOverflow = "";

export function setLenisInstance(instance: Lenis) {
    lenisInstance = instance;
    if (scrollLocks > 0) instance.stop();
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
    if (scrollLocks === 0) lenisInstance?.start();
}

export function lockPageScroll() {
    if (scrollLocks++ === 0) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        stopLenis();
    }
    let released = false;
    return () => {
        if (released) return;
        released = true;
        if (--scrollLocks === 0) {
            document.body.style.overflow = previousOverflow;
            startLenis();
        }
    };
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
