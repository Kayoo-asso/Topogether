type TitleCase<S extends string> = S extends `${infer Char}${infer Rest}`
	? `${Uppercase<Char>}${Rest}`
	: S;

type SetMethodTitleCase<S extends string> = `set${TitleCase<S>}`;

type EventTitleCase<S extends string> =
	S extends `${infer Base}:${infer Suffix}`
		? `on${TitleCase<Base>}${TitleCase<Suffix>}`
		: `on${TitleCase<S>}`;

export const eventMap = {
	"change:error": "changeError"
}

export function titleCase<S extends string>(s: S): TitleCase<S> {
	return s.charAt(0).toLocaleUpperCase() + s.substring(1) as any;
}

export function setMethodName<S extends string>(property: S): SetMethodTitleCase<S> {
	return `set${titleCase(property)}`;
}

export function eventPropName<S extends string>(
	eventName: S
): EventTitleCase<S> {
	const parts = eventName.split(":");
	let result = "on" + setMethodName(parts[0]);
	if (parts.length > 1) {
		result += setMethodName(parts[1]);
	}
	return result as any;
}
