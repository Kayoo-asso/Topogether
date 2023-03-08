import { LightGrade } from "types";

export const getFillLightGradeColorClass = (g: LightGrade) => {
    switch (g) {
        case 3:
            return "fill-grade-3";
        case 4:
            return "fill-grade-4";    
        case 5:
            return "fill-grade-5";
        case 6:
            return "fill-grade-6";
        case 7:
            return "fill-grade-7";
        case 8:
            return "fill-grade-8";
        case 9:
            return "fill-grade-9";
        case 'P':
            return "fill-grey-light";
    }
};

export const getBGLightGradeColorClass = (g: LightGrade) => {
    switch (g) {
        case 3:
            return "bg-grade-3";
        case 4:
            return "bg-grade-4";    
        case 5:
            return "bg-grade-5";
        case 6:
            return "bg-grade-6";
        case 7:
            return "bg-grade-7";
        case 8:
            return "bg-grade-8";
        case 9:
            return "bg-grade-9";
        case 'P':
            return "bg-grey-light";
    }
};