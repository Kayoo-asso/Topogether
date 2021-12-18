export const Grades = ['3', '3+', '4', '4+', '5a', '5a+', '5b', '5b+', '5c', '5c+', '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+', '9c', '9c+'] as const;

export const LightGrades = [3, 4, 5, 6, 7, 8, 9];

export type GradeEnum = typeof Grades[number];

export type LightGradeEnum = typeof LightGrades[number];

export const gradeToLightGrade = (grade: GradeEnum | LightGradeEnum) => {
  if (typeof grade === 'number') return grade;
  return parseInt(grade[0], 10) as LightGradeEnum;
};
