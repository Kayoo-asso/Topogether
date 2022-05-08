import React from "react";

export function setReactRef<T>(ref: React.MutableRefObject<T> | React.LegacyRef<T>, value: T) {
    if (typeof ref === "function") {
        ref(value);
    } else {
        (ref as React.MutableRefObject<T>).current = value;
    }
}