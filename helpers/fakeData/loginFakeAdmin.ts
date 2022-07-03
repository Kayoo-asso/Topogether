import { AuthService, SignInRes, SignUpRes, supabaseClient } from "helpers/services";
import { fakeAdmin } from "./fakeTopoV2";

export async function loginFakeAdmin(auth: AuthService): Promise<void> {
	let user = auth.session();

	if (user !== null) {
		const { user } = await supabaseClient.auth.refreshSession();
		if (user) {
			return;
		}
	}
	const signinRes = await auth.signIn(fakeAdmin.email, fakeAdmin.password);
	user = auth.session();
	if (signinRes !== SignInRes.Ok || user === null) {
		const signupRes = await auth.signUp(fakeAdmin.email, fakeAdmin.password, fakeAdmin.userName);
		user = auth.session();
		if (signupRes !== SignUpRes.LoggedIn || user === null) {
			throw new Error("Failed to sign up as fake admin");
		}
		// await auth.signOut();

		// const master = getSupaMasterClient()!;
		// await master.auth.signIn({ email: fakeAdmin.em})
		// const upgradeRes = await master.from<User>("accounts").update({ role: "ADMIN" }).eq('id', user.id);
		// if (upgradeRes.error) {
		//     console.error(upgradeRes.error);
		//     throw new Error("Failed to upgrade to ADMIN");
		// }
		// auth.updateUserInfo({
		//     ...user,
		//     role: "ADMIN"
		// });
	}
}
