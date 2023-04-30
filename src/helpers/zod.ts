import { z } from "zod";

export const userFormValidators = {
	email: z
		.string({
			invalid_type_error: veuillezEntrer("un email"),
			required_error: veuillezEntrer("un email"),
		})
		.email({ message: veuillezEntrer("un email valide") }),
	password: z
		.string({
			invalid_type_error: veuillezEntrer("un mot de passe"),
			required_error: veuillezEntrer("un mot de passe"),
		})
		.min(4, {
			message: "Le mot de passe doit faire un minimum de 4 caractères",
		}),

  username: z.string({
    invalid_type_error: veuillezEntrer("un nom d'utilisateur"),
    required_error: veuillezEntrer("un nom d'utilisateur")
  })
}

function veuillezEntrer(thing: string) {
  return "Veuillez entrer " + thing
}