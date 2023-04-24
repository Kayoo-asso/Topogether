import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter, type NextRouter } from "next/router";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/buttons/Button";
import { TextInput } from "~/components/ui/TextInput";
import { staticUrl } from "~/constants";

const formSchema = z.object({
	email: z
		.string({
			invalid_type_error: "Veuillez entrer un email",
			required_error: "Veuillez entrer un email",
		})
		.email({ message: "Veuillez entrer un email valide" }),
	password: z
		.string({
			invalid_type_error: "Veuillez entrer un mot de passe",
			required_error: "Veuillez entrer un mot de passe",
		})
		.min(4, {
			message: "Le mot de passe doit faire un minimum de 4 caractères",
		}),
});

type Form = z.infer<typeof formSchema>;

export function LoginForm() {
	const router = useRouter();
	// Redirect to world map by default
	const redirectUrl = getRedirectUrl(router, "/");
	const { signIn, setActive, isLoaded: signInReady } = useSignIn();
	// Need to specify the type, react-hook-form can't infer it based on the resolver
	const form = useForm<Form>({ resolver: zodResolver(formSchema) });

	const formState = useFormState({ control: form.control });

	const login = useMutation({
		mutationKey: ["login"],
		mutationFn: async (form: Form) => {
			// Based on: https://clerk-docs.clerkpreview.com/hooks/authentication/use-sign-in#sign-in-a-user-with-a-custom-flow
			if (signIn) {
				const res = await signIn.create({
					identifier: form.email,
					password: form.password,
					redirectUrl,
				});
				if (res.status === "complete") {
					setActive({ session: res.createdSessionId });
				} else {
					// Will be catched by TanStack Query, we'll just check the `login.isError` flag
					throw new Error();
				}
			}
		},
	});

	return (
		<form
			className="flex w-full flex-col items-center gap-6"
			onSubmit={form.handleSubmit((data) => login.mutate(data))}
		>
			<div className="ktext-section-title hidden self-start md:block">
				Se connecter
			</div>
			<div className="relative mt-10 h-[150px] w-[150px] md:hidden">
				<NextImage
					src={staticUrl.logo_color}
					priority
					alt="Logo Topogether"
					fill
				/>
			</div>

			<TextInput
				id="email"
				label="Email"
				error={formState.errors.email?.message}
				{...form.register("email")}
			/>

			<TextInput
				id="password"
				label="Mot de passe"
				error={formState.errors.password?.message}
				type="password"
				{...form.register("password")}
			/>

			<div className="flex w-full flex-col items-center justify-start md:mb-6 md:flex-row md:justify-between">
				<div>
					<Button content="Se connecter" fullWidth loading={login.isLoading || !signInReady} activated={signInReady}  />
					{login.isError && (
						<div className="ktext-error mt-3 text-error">
							Une erreur s'est produite, veuillez réessayer.
						</div>
					)}
				</div>
			</div>

			<div className="flex w-full flex-col gap-16">
				<div className="flex w-full flex-row items-center justify-center md:justify-between">
					<Link
						href="/signup"
						className="ktext-base-little hidden text-main md:block md:cursor-pointer"
					>
						Créer un compte
					</Link>
					<Link
						href="/forgotPassword"
						className="ktext-base-little text-main md:cursor-pointer"
					>
						Mot de passe oublié ?
					</Link>
				</div>

				<div className="w-full md:hidden">
					<Button
						content="Créer un compte"
						fullWidth
						href="/signup"
						// activated={isLoaded}
					/>
				</div>
			</div>
		</form>
	);
}

function getRedirectUrl(router: NextRouter, defaultRedirect: string): string {
	const queryParam = router.query.redirect_to;
	if (Array.isArray(queryParam)) {
		return queryParam[0];
	}
	return queryParam || defaultRedirect;
}
