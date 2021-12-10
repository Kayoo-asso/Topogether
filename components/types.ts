export type baseColor = 'main' | 'second' | 'third' | 'white';
export type structureColor = 'dark' | 'medium' | 'light' | 'superlight' | 'error';
export type diffColor = 'diff-3' | 'diff-2' | 'diff-3' | 'diff-4' | 'diff-5' | 'diff-6' | 'diff-7';
export type color = baseColor & structureColor & diffColor;