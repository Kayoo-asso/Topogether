import { CloseButton } from "~/components/buttons/CloseButton";

interface PreviewButtonsProps{
	onClose: () => void;
};

export function PreviewButtons(props: React.PropsWithChildren<PreviewButtonsProps>) {
	return (
		<div className="absolute z-10 mt-2 w-full flex-row justify-between px-3 flex">
			<div className="relative flex flex-row items-center justify-evenly gap-5 rounded-full bg-white px-4 md:cursor-pointer">
				{props.children}
			</div>

			<div
				className="flex items-center justify-center rounded-full bg-white h-14 w-14 cursor-pointer"
				onClick={props.onClose}
			>
				<CloseButton />
			</div>
		</div>
	);
}
