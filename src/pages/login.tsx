import { LoginForm } from "~/components/forms/LoginForm";
import { Header } from "~/components/layout/Header";

function LoginPage() {
  return (
    <div className="w-full h-full flex-col">
      <Header backLink="/" title="Connexion" />

			<div className="flex h-content w-full flex-col items-center justify-center overflow-auto bg-white bg-bottom md:h-full md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="w-full bg-white p-10 md:w-[500px] md:rounded-lg md:shadow">
					<LoginForm />
				</div>
			</div>
    </div>
  )
}

export default LoginPage;