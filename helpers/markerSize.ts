type Size = {
    width: number,
    height: number,
    equals: (other: google.maps.Size|null) => boolean,
}

export const markerSize = (w: number, h?: number): Size => {
    return {
      width: w,
      height: h || w,
      equals: function (other) {
        return other !== null && this.width === other.width && this.height === other.height;
      },
    }
  }