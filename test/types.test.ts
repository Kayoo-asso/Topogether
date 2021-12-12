import { imageTypes, isImageType } from "types/ImageTypes"

test('isImageType is correct', () => {
    for(const imgType of imageTypes) {
        expect(isImageType(imgType)).toBe(true);
    }
})