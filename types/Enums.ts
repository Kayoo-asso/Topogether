export enum Difficulty {
    Good,
    OK,
    Bad,
    Dangerous
};

export enum Orientation {
    N,
    NE,
    E,
    SE,
    S,
    SW,
    W,
    NW
};

export type Rating = 1 | 2 | 3 | 4 | 5;

export type Grade = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export enum TopoStatus {
    Draft,
    Submitted,
    Validated
}

export enum TopoType {
    Boulder,
    Cliff,
    DeepWater,
    Multipitch,
    Artificial
}