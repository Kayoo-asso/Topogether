import { auth, AuthResult, supabaseClient } from "helpers/services";
import { fakeAdmin } from "./fakeTopoV2";

export async function loginFakeAdmin(): Promise<void> {
    let user = auth.session();
    // sign out, to avoid problems with stale tokens after DB reset
    if (user !== null) {
        const { user } = await supabaseClient.auth.refreshSession();
        if (user) {
            return;
        }
    }
    const signinRes = await auth.signIn(fakeAdmin.email, fakeAdmin.password, "/builder/dashboard");
    user = auth.session();
    if (signinRes !== AuthResult.Success || user === null) {
        const signupRes = await auth.signUp(fakeAdmin.email, fakeAdmin.password, fakeAdmin.userName);
        user = auth.session();
        if (signupRes !== AuthResult.Success) {
            throw new Error("Failed to sign up as fake admin");
        }
        if (user === null) {
            throw new Error("Signed up but user is still null");
        }
    }
}