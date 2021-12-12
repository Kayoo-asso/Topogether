import { diffIdsToGrade } from "./diffIdsToGrade";

export const getGradeFromDiffIds = (diffIds: number[]) => {
    let diffs: string[] = []
    diffIds.forEach(id => {
        const grade = diffIdsToGrade.find(elt => elt.id === id);
        if (grade && grade.label)
            diffs.push(grade.label);
    });
    return diffs;
}

export const getGradeFromDiffId = (diffId: number) => {
    return getGradeFromDiffIds([diffId])[0];
}

export const getLightGradeFromDiffId = (diffId: number) => {
    return getGradeFromDiffIds([diffId])[0].substring(0, 1);
}