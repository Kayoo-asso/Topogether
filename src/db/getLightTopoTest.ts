import { getLightTopos } from "~/server/queries";

const start = Date.now();
const result = await getLightTopos();

console.log(result.map((x) => ({ name: x.name, grades: x.allGrades })));
const end = Date.now();
console.log(`Query took ${end - start}ms`);

process.exit(0);
