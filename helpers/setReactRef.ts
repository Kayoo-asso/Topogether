export function setReactRef<T>(
    // React types for refs are a mess, using manual ones is easier
    ref: { current: T } | ((value: T) => void) | null,
    value: T
) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}