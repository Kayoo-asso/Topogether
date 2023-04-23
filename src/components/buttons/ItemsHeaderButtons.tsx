import { CloseButton } from "~/components/buttons/CloseButton";

type PreviewButtonsProps = React.PropsWithChildren<{
	onClose: () => void;
}>;

export function PreviewButtons(props: PreviewButtonsProps) {
	return (
		<div className="absolute z-10 mt-2 hidden w-[90%] flex-row justify-between px-2 md:flex">
			<div className="relative flex flex-row items-center justify-evenly gap-5 rounded-full bg-white px-4 md:cursor-pointer">
				{props.children}
			</div>

			<div
				className="flex items-center justify-center rounded-full bg-white px-6 py-6"
				onClick={props.onClose}
			>
				<CloseButton />
			</div>
		</div>
	);
}
