import { diffIdsToGrade } from "./diffIdsToGrade";

export const getGradeFromDiffIds = (diffIds: number[]) => {
    let diffs: string[] = []
    diffIds.forEach(id => {
        const grade = getGradeFromDiffId(id);
        if (grade) diffs.push(grade);
    });
    return diffs;
}

export const getLightGradeFromDiffIds = (diffIds: number[]) => {
    let diffs: string[] = []
    diffIds.forEach(id => {
        const grade = getLightGradeFromDiffId(id);
        if (grade) diffs.push(grade);
    });
    return diffs;
}

export const getGradeFromDiffId = (diffId: number) => {
    return diffIdsToGrade.find(elt => elt.id === diffId)?.label;
}

export const getLightGradeFromDiffId = (diffId: number) => {
    return diffIdsToGrade.find(elt => elt.id === diffId)?.label.substring(0, 1);
}