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

const profiles = await sql`
  SELECT * 
  FROM public.accounts
`;

function formatUsername(str) {
  let result = str
  if(result) {
    // remove all white spaces
    result = result.replaceAll(' ', '');
    while(result.length < 4) {
      result += '_'
    }
  }
  if(result !== str) {
    console.log(`${str} -> ${result}`)
  }
  return result;
}

function createInClerk(user) {
	const profile = profiles.find((x) => x.id === user.id);
	if (!profile) {
		throw new Error("Could not find profile for user:", user);
	}
  const username = formatUsername(profile.userName);
	// console.log(profile)
	// return fetch("https://api.clerk.dev/v1/users/" + user.id, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
	// 	},
	// 	body: JSON.stringify({
	// 		external_id: user.id,
	// 		first_name: profile.firstName,
	// 		last_name: profile.lastName,
	// 		email_address: [user.email],
	// 		phone_number: user.phone ? [user.phone] : undefined,
  //     // Ended up removing the username, we'll show it 
	// 		// username: profile.userName,
	// 		password_digest: user.encrypted_password,
	// 		password_hasher: "bcrypt",
	// 		created_at: user.confirmed_at,
	// 	}),
	// })
	// 	.then((res) => {
	// 		if (!res.ok) {
	// 			res.text().then((text) => {
	// 				// console.log(`=== Failed creating user ${profile.userName} ===`);
	// 				// console.log(text);
	// 			});
	// 		} else {
	// 			console.log("-> Created user " + profile.userName);
	// 		}
	// 	})
	// 	.catch((e) => {
	// 		// console.log(`=== Failed creating user ${profile.userName} ===`);
	// 		// console.log(e);
	// 	});
}

await Promise.all(users.map(createInClerk));

console.log("DONE")