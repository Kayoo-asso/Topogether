import postgres from "postgres";
import * as dotenv from "dotenv";
dotenv.config();

// Small script to transfer our users from Supabase to Clerk

const sql = postgres({
	host: process.env.SUPABASE_PGHOST,
	user: "postgres",
	pass: process.env.SUPABASE_PASS,
	database: "postgres",
	ssl: "require",
});

const users = await sql`
  SELECT id, email, encrypted_password, confirmed_at
  FROM auth.users
  WHERE confirmed_at IS NOT NULL
`;

const accounts = await sql`
  SELECT * 
  FROM public.accounts
`;

function formatUsername(str) {
	let result = str;
	if (result) {
		// remove all white spaces
		result = result.replaceAll(" ", "");
		result = result.replaceAll('é', 'e')
		while (result.length < 4) {
			result += "_";
		}
	}
	// if(result !== str) {
	//   console.log(`${str} -> ${result}`)
	// }
	return result;
}

function buildMetadata(account) {
	const meta = {
		role: account.role,
	};
	if (account.country) {
		meta.country = account.country;
	}
	if (account.city) {
		meta.city = account.city;
	}
	if (account.birthDate) {
		meta.birthData = account.birthDate;
	}
	if (account.image) {
		// The image was returned as a string by Postgres, in the format `(id, ratio, placeholder)`
		const imgStr = account.image.substring(1, account.image.length - 1);
		let [id, ratio, placeholder] = imgStr.split(",");
		// Convert ratio to number
		ratio = +ratio;
		meta.image = {
			id, ratio, placeholder
		};
	}
	return meta;
}

function createInClerk(user) {
	const account = accounts.find((x) => x.id === user.id);
	if (!account) {
		throw new Error("Could not find profile for user:", user);
	}
	const public_metadata = buildMetadata(account);
	const username = formatUsername(account.userName)
	console.log(`-- ${username} --`)
	console.log(public_metadata);

	return fetch("https://api.clerk.dev/v1/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
		},
		body: JSON.stringify({
			external_id: user.id,
			first_name: account.firstName,
			last_name: account.lastName,
			username,
			public_metadata,
			email_address: [user.email],
			phone_number: user.phone ? [user.phone] : undefined,
			password_digest: user.encrypted_password,
			password_hasher: "bcrypt",
			created_at: user.confirmed_at,
		}),
	})
		.then((res) => {
			if (!res.ok) {
				res.text().then((text) => {
					console.log(`=== Failed creating user ${username} ===`);
					console.log(text);
				});
			} else {
				console.log("-> Created user " + username);
			}
		})
		.catch((e) => {
			console.log(`=== Failed creating user ${username} ===`);
			console.log(e);
		});
}

const clerkUsers = await fetch("https://api.clerk.dev/v1/users?limit=100", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
		},
}).then(x => x.json()).then(x => x.map(y => y.external_id));

const existingUsers = new Set(accounts.map(x => x.id));
for(const id of clerkUsers) {
	if(!existingUsers.has(id)) {
		console.log("Missing user " + id)
	}
}

// await Promise.all(users.map(createInClerk));

console.log("DONE");
