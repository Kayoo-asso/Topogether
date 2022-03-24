import { auth, AuthResult } from "helpers/services";
import { fakeAdmin } from "./fakeTopoV2";

export async function loginFakeAdmin(): Promise<void> {

    let user = auth.session();
    // sign out, to avoid problems with stale tokens after DB reset
    if (user !== null) {
        localStorage.removeItem("supabase.auth.token");
    }
    const signinRes = await auth.signIn(fakeAdmin.email, fakeAdmin.password);
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