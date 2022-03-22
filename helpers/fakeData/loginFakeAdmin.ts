import { api, AuthResult } from "helpers/services";
import { User } from "types";
import { fakeAdmin } from "./fakeTopoV2";

export async function loginFakeAdmin(): Promise<User> {
    console.log("Logging in as fake admin...");

    let user = api.user();
    if (user === null) {
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
    }
    console.log("Successful login as fake admin! id = ", user.id);
    return user;
}