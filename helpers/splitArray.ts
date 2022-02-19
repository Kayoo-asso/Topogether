export const splitArray = function<T>(arr: T[], predicate: (arg: T) => boolean) {
    const matches = [];
    const notMatches = [];
    for (const elt of arr) {
      if (predicate(elt)) matches.push(elt)
      else notMatches.push(elt);
    }
    return [matches, notMatches];
}