import { User } from "types";

// The created date comes from the 
export function usersShouldBeEqual(expected: User, actual: User) {
    const {
        created: aCreated,
        ...userA
    } = expected;

    const {
        created: bCreated,
        ...userB
    } = actual;

    expect(userA).toStrictEqual(userB);
}