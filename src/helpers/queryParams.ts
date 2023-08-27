import { useRouter, type NextRouter } from "next/router";
import { useCallback } from "react";
import { z } from "zod";
import { UUID, UpdateState } from "~/types";
import { decodeUUID, encodeUUID } from "~/utils";

function getKey<Allowed extends string>(
	router: NextRouter,
	key: string,
	allowed?: Allowed[]
) {
	let value = router.query[key];
	if (Array.isArray(value)) {
		console.error(`Received array value for query param ${key}`);
		return undefined;
	}
	// Ignore non-allowed values
	if (allowed && value && !(allowed as string[]).includes(value)) {
		return undefined;
	}
	return value as Allowed;
}

interface UseQueryParamOptions<
	Allowed extends string = string,
	Input extends string = string,
	Output extends string = string
> {
	allowed?: Allowed[];
	encode?: (input: Input) => string | undefined;
	decode?: (query: string | undefined) => Output;
}

// A small helper to encode state into the URL, before
// we properly transition to the Next App Router
export function useQueryParam(
	key: string
): [string | undefined, (value: string | undefined) => void];
export function useQueryParam<Allowed extends string>(
	key: string,
	allowed: Allowed[]
): [Allowed | undefined, (value: Allowed | undefined) => void];

export function useQueryParam<Allowed extends string>(
	key: string,
	allowed?: Allowed[]
) {
	const router = useRouter();
	const value = getKey(router, key, allowed);

	const set = useCallback(
		(update: UpdateState<Allowed | undefined>) => {
			if (typeof update === "function") {
				update = update(getKey(router, key, allowed));
			}
			const query = addQueryParam(router, key, update);
			router.push({ pathname: router.pathname, query }, undefined, {
				shallow: true,
			});
		},
		// `allowed` is an array of strings or undefined, so JSON.stringify works fine for our purposes here
		[router, key, JSON.stringify(allowed)]
	);

	return [value, set] as const;
}

const uuidValidator = z.string().uuid();

export function useUUIDQueryParam(key: string) {
	const [value, set] = useQueryParam(key);
	let decodedValue = undefined;
	if (value && uuidValidator.safeParse(value).success) {
		decodedValue = decodeUUID(value);
	}
	const wrappedSet = (update: UpdateState<UUID>) => {
		let wrappedUpdate: UpdateState<string>;
		if (typeof update === "function") {
			wrappedUpdate = (state: string | undefined) => {
				let decodedState = undefined;
				if (state && uuidValidator.safeParse(state).success) {
					decodedState = decodeUUID(state as UUID);
				}
			};
		}
		set(encodeUUID(update));
	};
	return [decodedValue, wrappedSet] as const;
}

export function urlWithQueryParam(
	router: NextRouter,
	key: string,
	value: string | undefined
): string {
	// Clone the current query object
	const updatedQuery = addQueryParam(router, key, value);

	// Update the query object based on the key and value
	if (value === undefined) {
		delete updatedQuery[key];
	} else {
		updatedQuery[key] = value;
	}

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
