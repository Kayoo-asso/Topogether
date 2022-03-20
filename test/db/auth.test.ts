import { api, AuthResult } from 'helpers/services';
import { Name, User, UUID, Email } from 'types';
import { v4 as uuid } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// === CLEANUP === 
const masterClient = createClient(
    process.env.NEXT_PUBLIC_API_URL!,
    process.env.API_MASTER_KEY_LOCAL!
);

let createdUsers: string[] = [];

function cleanupUser(id: string) {
    createdUsers.push(id);
}

afterEach(async () => {
    const promises = createdUsers.map(async id => {
        // Should cascade to the user table
        const {error } = await masterClient.auth.api.deleteUser(id)
        if (error) {
            console.debug("Error deleting user: ", error);
        }
    });
    await Promise.all(promises);
});

// === TESTS ===

const user1: User = {
    id: null!, // replaced within tests
    userName: "SuperPierre" as Name,
    email: "pierre@kayoo-asso.fr" as Email,
    role: "USER",
    created: new Date().toISOString(),
    imagePath: "Pretend there's an image here",
    firstName: "Pierre" as Name,
    lastName: "Tournelolotte" as Name,
    country: "France" as Name,
    city: "Lyon" as Name,
    phone: "0xdeadbeef" as any,
    birthDate: "2020/09/12",
};
const user1Password = "Abricadabrou";

test.skip("Signing up and creating a profile", async () => {
    expect(await api.signup(user1.email, user1Password, user1.userName))
        .toBe(AuthResult.Success);

    const user = api.user();
    expect(user).not.toBe(null);
    cleanupUser(user!.id);

    expect(await api.updateUserInfo({
        ...user!,
        city: "Lyon" as Name,
    })).toBe(AuthResult.Success);

    expect(api.user()?.city).toBe("Lyon");
});


