import React, { useCallback } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AuthService, supabaseClient, useAuth } from "helpers/services";
import { useQuarkyEffect } from "helpers/quarky";
import { Header } from "components/layouts/Header";
import { LoginForm } from "components/organisms/user/LoginForm";

async function ifLoggedIn(auth: AuthService, redirect: () => Promise<void>) {
	// TODO: Add indicator
	if (auth.session()) {
		await supabaseClient.auth.refreshSession();
		if (auth.session()) {
			await redirect();
		}
	}
}

const LoginPage: NextPage = () => {
	const auth = useAuth();
	const router = useRouter();
	const redirectTo = router.query["redirectTo"];

	const redirect = useCallback(async () => {
		if (typeof redirectTo === "string") {
			await router.push(redirectTo);
		} else {
			await router.push("/");
		}
	}, [redirectTo]);

	// the Quarky effect allows it to trigger if we end up receiving a fresh session after this hook has run
	useQuarkyEffect(() => {
		ifLoggedIn(auth, redirect);
	}, [auth, router]);

	return (
		<>
			<Header backLink="/" title="Connexion" />

			<div className="flex h-content w-full flex-col items-center justify-center overflow-auto bg-white bg-bottom md:h-full md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="w-full bg-white p-10 md:w-[500px] md:rounded-lg md:shadow">
					<LoginForm onLogin={redirect} />
				</div>
			</div>
		</>
	);
};

export default LoginPage;
