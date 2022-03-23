import { api, AuthResult } from "helpers/services";
import { User } from "types";
import { fakeAdmin } from "./fakeTopoV2";

export async function loginFakeAdmin(): Promise<User> {
    console.log("Logging in as fake admin...");

    let user = api.user();
    // sign out, to avoid problems with stale tokens after DB reset
    if (user !== null) {
        const signoutRes = await api.signOut();
        if (signoutRes !== AuthResult.Success) {
            throw new Error("Failed to sign out when setting up fake admin");
        }
    }
    const signinRes = await api.signIn(fakeAdmin.email, fakeAdmin.password);
    user = api.user();
    if (signinRes !== AuthResult.Success || user === null) {
        const signupRes = await api.signup(fakeAdmin.email, fakeAdmin.password, fakeAdmin.userName);
        user = api.user();
        if (signupRes !== AuthResult.Success) {
            throw new Error("Failed to sign up as fake admin");
        }
        if (user === null) {
            throw new Error("Signed up but user is still null");
        }
    }
    return user;
}