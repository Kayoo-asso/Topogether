import { useRouter, type NextRouter } from "next/router";
import { useCallback } from "react";
import { z } from "zod";
import { uuid } from "~/db/custom";
import { UUID } from "~/types";
import { decodeUUID, encodeUUID } from "~/utils";

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
	const set = useCallback(
		(value: Allowed | undefined) => {
			const query = addQueryParam(router, key, value);
			router.push({ pathname: router.pathname, query }, undefined, { shallow: true});
		},
		[router]
	);

	let value = router.query[key];
	if (Array.isArray(value)) {
		throw new Error("useQueryParam does not support array values for now");
	}
	if (allowed && value && !(allowed as string[]).includes(value)) {
		// Clear the value
		value = undefined;
	}

	return [value as Allowed | undefined, set] as const;
}

const uuidValidator = z.string().uuid();
export function useUUIDQueryParam(key: string) {
	const [value, set] = useQueryParam(key);
	let safeValue = undefined;
	if(value && uuidValidator.safeParse(value).success) {
		safeValue = decodeUUID(value);
	}
	const wrappedSet = (value: UUID) => {
		set(encodeUUID(value));
	}	
	return [safeValue, wrappedSet] as const;
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

