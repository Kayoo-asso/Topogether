import { useRouter, type NextRouter } from "next/router";
import { useCallback } from "react";
import { decodeUUID, encodeUUID } from "~/utils";

interface UseQueryParamOptions<
	Input extends string = string,
	Output extends string = string
> {
	encode?: (input: Input) => string | undefined;
	decode?: (query: string) => Output | undefined;
}

// A small helper to encode state into the URL, before
// we properly transition to the Next App Router
export function useQueryParam<
	Input extends string = string,
	Output extends string = string
>(key: string, options?: UseQueryParamOptions<Input, Output>) {
	const router = useRouter();
	const value = extractQuery(router, key, options?.decode);

	const set = useCallback(
		(
			update:
				| (Input | undefined)
				| ((state: Output | undefined) => Input | undefined)
		) => {
			if (typeof update === "function") {
				update = update(extractQuery(router, key, options?.decode));
			}
			let query: ReturnType<typeof addQueryParam>;
			if (options?.encode && update !== undefined) {
				query = addQueryParam(router, key, options.encode(update));
			} else {
				query = addQueryParam(router, key, update);
			}
			router.push({ pathname: router.pathname, query }, undefined, {
				shallow: true,
			});
		},
		// `allowed` is an array of strings or undefined, so JSON.stringify works fine for our purposes here
		[router, key, options?.decode]
	);

	return [value, set] as const;
}

function extractQuery<Output extends string = string>(
	router: NextRouter,
	key: string,
	decode?: (query: string) => Output | undefined
) {
	let value = router.query[key];
	// Only allow string values
	if (typeof value !== "string") {
		value = undefined;
	}
	if (decode && value !== undefined) {
		return decode(value);
	}
	return value as Output | undefined;
}

export function useUUIDQueryParam(key: string) {
	return useQueryParam(key, {
		encode: encodeUUID,
		decode: decodeUUID,
	});
}

export function urlWithQueryParam(
	router: NextRouter,
	key: string,
	value: string | undefined
): string {
	// Update the query object based on the key and value
	const updatedQuery = addQueryParam(router, key, value);

	// Create a new query string from the updated query object
	const searchParams = new URLSearchParams(
		updatedQuery as Record<string, string> // small lie for TypeScript
	).toString();

	// Build a new URL using the router's pathname and the updated query string
	const newUrl = `${router.pathname}${searchParams ? "?" + searchParams : ""}`;

	return newUrl;
}

function addQueryParam(
	router: NextRouter,
	key: string,
	value: string | undefined
) {
	const query = { ...router.query };
	if (value === undefined) {
		delete query[key];
	} else {
		query[key] = value;
	}
	return query;
}
