import Link from "next/link";
import NextImage from "next/image";
import { Header } from "~/components/layout/Header";

interface Error404Props {
	title: string;
}

export default function (props: Error404Props) {
	return (
		<>
			<Header title={props.title} backLink="#" />
			<Link href="/">
				<a className="relative flex h-full w-full md:cursor-pointer items-center justify-center bg-white">
					<NextImage
						src="/assets/img/404_error_topo_climbing.png"
						priority
						alt="Erreur 404"
						fill
					/>
				</a>
			</Link>
		</>
	);
}
