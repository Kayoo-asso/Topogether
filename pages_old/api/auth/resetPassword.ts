import { getSupaMasterClient } from "helpers/services";
import { NextApiHandler } from "next";
import { isEmail } from "types";

const handler: NextApiHandler = async (req, res) => {
	const client = getSupaMasterClient()!;
	const { email, redirectTo } = req.body;
	if (!isEmail(email)) {
		res.status(400).end();
	}

	const { error } = await client.auth.api.resetPasswordForEmail(email, {
		redirectTo,
	});
	if (error) {
		console.error("Error resetting password for " + email + ":", error);
		res.status(500).end();
	}
	res.status(200).end();
};

export default handler;
