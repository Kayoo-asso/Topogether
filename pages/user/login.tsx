import React, { useCallback } from "react";
import type { NextPage } from "next";
import { LoginForm } from "components";
import { useRouter } from "next/router";
import { AuthService, supabaseClient, useAuth } from "helpers/services";
import { useQuarkyEffect } from "helpers/quarky";
import { Header } from "components/layouts/Header";

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

			<div className="w-full h-content md:h-full flex flex-col items-center justify-center overflow-auto bg-bottom bg-white md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="p-10 w-full bg-white md:w-[500px] md:shadow md:rounded-lg">
					<LoginForm onLogin={redirect} />
				</div>
			</div>
		</>
	);
};

export default LoginPage;
