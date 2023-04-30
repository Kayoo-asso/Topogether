import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { Header } from "~/components/layout/Header";
import { staticUrl } from "~/constants";
import { TextInput } from "~/components/ui/TextInput";
import { Button } from "~/components/buttons/Button";
import { z } from "zod";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormValidators } from "~/helpers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
	username: z.string({
		required_error: "Veuillez entrer un nom d'utilisateur",
		invalid_type_error: "Veuillez entrer un nom d'utilisateur",
	}),
	email: userFormValidators.email,
	password: userFormValidators.password,
});

type Form = z.infer<typeof formSchema>;

const SignupPage: NextPage = () => {
	const router = useRouter();
	const { isLoaded: signUpReady, signUp, setActive } = useSignUp();

	const form = useForm<Form>({ resolver: zodResolver(formSchema) });
	const formState = useFormState({ control: form.control });

	const submit = useMutation({
		mutationKey: ["sign-up"],
		mutationFn: async (form: Form) => {
			if (signUp) {
				//
				try {
					const create = await signUp.create({
						emailAddress: form.email,
						password: form.password,
						username: form.username,
					});
					await setActive({ session: create.createdSessionId });
					if (create.status === "complete") {
						router.push("/");
						return "success";
					} else if (
						create.status === "missing_requirements" &&
						create.unverifiedFields.includes("email_address")
					) {
						const verif = await signUp.prepareEmailAddressVerification({
							strategy: "email_link",
							redirectUrl: "http://localhost:3000/",
						});
						await setActive({ session: verif.createdSessionId });
						if (verif.status === "complete") {
							router.push("/");
								return "success";
						} else if (
							verif.status === "missing_requirements" &&
							verif.unverifiedFields.includes("email_address")
						) {
							return "verifying";
						}
					}
				} catch {
					return "error";
				}

				return "error";
			}
		},
	});

	return (
		<div className="flex h-full w-full flex-col">
			<Header
				backLink="/user/login"
				title="Création de compte"
				displayLogin={true}
			/>

			<div className="flex h-full w-full flex-col items-center justify-center bg-white bg-bottom md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="-mt-16 w-full bg-white p-10 md:mt-0 md:w-[500px] md:rounded-lg md:shadow">
					<form
						className="flex w-full flex-col items-center gap-6"
						onSubmit={form.handleSubmit((data) => submit.mutate(data))}
					>
						<div className="ktext-section-title hidden self-start md:block">
							Créer un compte
						</div>

						<div className="relative h-[150px] w-[150px] md:hidden">
							<NextImage
								src={staticUrl.logo_color}
								priority
								alt="Logo Topogether"
								fill
							/>
						</div>

						<TextInput
							id="username"
							label="Pseudo"
							{...form.register("username")}
							error={formState.errors.username?.message}
						/>
						<TextInput
							id="email"
							label="Email"
							{...form.register("email")}
							error={formState.errors.email?.message}
						/>
						<TextInput
							id="password"
							type="password"
							label="Mot de passe"
							{...form.register("password")}
							error={formState.errors.password?.message}
						/>

						<Button
							content="Créer un compte"
							fullWidth
							loading={submit.isLoading || !signUpReady}
							activated={signUpReady}
						/>
						{submit.data === "error" && (
							<div className="ktext-error text-error">
								Une erreur est survenue, merci de réessayer
							</div>
						)}
						{submit.data === "verifying" && (
							<div className="ktext-error text-main">
								Un email de vérification vous a été envoyé. Cliquez le lien à l'intérieur pour vous connecter.
							</div>
						)}
						<Link
							href="/user/login"
							className="ktext-base-little hidden text-main md:block md:cursor-pointer"
						>
							Retour
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
