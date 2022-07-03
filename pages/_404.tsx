import Link from "next/link";
import NextImage from "next/image";
import { Header } from "components/layouts/Header";

interface Error404Props {
	title: string;
}

export default function (props: Error404Props) {
	return (
		<>
			<Header title={props.title} backLink="#" />
			<Link href="/">
				<a className="w-full h-full relative bg-white flex items-center justify-center cursor-pointer">
					<NextImage
						src="/assets/img/404_error_topo_climbing.png"
						priority
						alt="Erreur 404"
						layout="fill"
						objectFit="contain"
					/>
				</a>
			</Link>
		</>
	);
}
