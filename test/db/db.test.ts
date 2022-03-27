import { loginFakeAdmin } from "helpers/fakeData/loginFakeAdmin"
import { seedLocalDb } from "helpers/fakeData/seedLocalDb";

test("Login fake admin + seed DB", async () => {
    await loginFakeAdmin();
    await seedLocalDb();
});