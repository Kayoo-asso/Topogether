import { apiService } from 'helpers/services/ApiService';
import { Name, ProfileUpdate, ProfileCreate, User, UUID } from 'types';
import { v4 as uuid } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const masterClient = createClient(
    process.env.API_URL_LOCAL!,
    process.env.API_MASTER_KEY_LOCAL!
);

let createdUsers: string[] = [];

function cleanupUser(id: string) {
    createdUsers.push(id);
}

afterEach(async () => {
    const promises = createdUsers.map(id => masterClient.auth.api.deleteUser(id));
    await Promise.all(promises);
});

test("Establishing connection", async () => {
    const allUsers = await apiService.client.from("profiles").select("*")
    expect(allUsers.status).toBe(200);
});

test("Signing up and creating a profile", async () => {
    const authDetails = {
        email: "erwin.kuhn@protonmail.com",
        password: "yooooooo"
    };
    const data: ProfileCreate = {
        pseudo: "SecretErwin" as Name,
        first_name: "Erwin" as Name,
        last_name: "Kuhn" as Name,
    };
    // in practice, the user would have to sign in
    const { user, session, error } = await apiService.client.auth.signUp(authDetails, { data });
    if (user) {
        cleanupUser(user.id);
    }

    expect(error).toBe(null);
    expect(user?.email).toBe(authDetails.email);
    expect(session?.user?.user_metadata).toStrictEqual(data);


    const res = await apiService.client.from<ProfileUpdate>("profiles").insert({
        id: user!.id as UUID,
        ...data
    });
    expect(res.error).toBe(null);
    expect(res.data).not.toBe(null);

    const userData = await apiService.client
        .from<ProfileUpdate>("profiles")
        .select("*")
        .match({
            id: user!.id
        })
        .single();

    expect(userData.data?.pseudo).toBe(data.pseudo);
    expect(userData.data?.first_name).toBe(data.first_name);
    expect(userData.data?.last_name).toBe(data.last_name);
});


