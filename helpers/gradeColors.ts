import { Grade, gradeToLightGrade } from "types";

// Dont' export this and try to import it in component for direct use !! Tailwing can't guarantee rendering.
// Need to copy and paste these functions in any component that use the function

const getFillGradeColorClass = (g: Grade | undefined) => {
    if (!g) return "fill-grey-light";
    const lightGrade = gradeToLightGrade(g);
    switch (lightGrade) {
        case 3: return "fill-grade-3";
        case 4: return "fill-grade-4"; break;
        case 5: return "fill-grade-5"; break;
        case 6: return "fill-grade-6"; break;
        case 7: return "fill-grade-7"; break;
        case 8: return "fill-grade-8"; break;
        case 9: return "fill-grade-9"; break;
        case 'P': return "fill-grey-light"; break;
    }
};

const getBGGradeColorClass = (g: Grade | undefined) => {
    if (!g) return "bg-grey-light";
    const lightGrade = gradeToLightGrade(g);
    switch (lightGrade) {
        case 3: return "bg-grade-3"; break;
        case 4: return "bg-grade-4"; break;
        case 5: return "bg-grade-5"; break;
        case 6: return "bg-grade-6"; break;
        case 7: return "bg-grade-7"; break;
        case 8: return "bg-grade-8"; break;
        case 9: return "bg-grade-9"; break;
        case 'P': return "bg-grey-light"; break;
    }
};

const getStrokeGradeColorClass = (g: Grade | undefined) => {
	if (!g) return "stroke-grey-light";
    const lightGrade = gradeToLightGrade(g);
    switch (lightGrade) {
        case 3: return "stroke-grade-3"; break;
        case 4: return "stroke-grade-4"; break;
        case 5: return "stroke-grade-5"; break;
        case 6: return "stroke-grade-6"; break;
        case 7: return "stroke-grade-7"; break;
        case 8: return "stroke-grade-8"; break;
        case 9: return "stroke-grade-9"; break;
        case 'P': return "stroke-grey-light"; break;
    }
};

const getTextGradeColorClass = (g: Grade | undefined) => {
	if (!g) return "text-grey-light";
	else {
		const lightGrade = gradeToLightGrade(g);
		switch (lightGrade) {
			case 3: return "text-grade-3"; break;
			case 4: return "text-grade-4"; break;
			case 5: return "text-grade-5"; break;
			case 6: return "text-grade-6"; break;
			case 7: return "text-grade-7"; break;
			case 8: return "text-grade-8"; break;
			case 9: return "text-grade-9"; break;
            case 'P': return "text-grey-light"; break;
		}
	}
};