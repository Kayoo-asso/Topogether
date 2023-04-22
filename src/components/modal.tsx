import Clear from "assets/icons/clear.svg";
import NextImage from "next/image";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "~/components/buttons/Button";

export type ModalProps<T = undefined> = React.PropsWithChildren<{
	buttonText?: string;
	imgUrl?: string;
	onConfirm?: (item: T) => void;
	onClose?: (item: T) => void;
}>;

type Toggles<T> = {
	setOpen: (open: boolean) => void;
	setItem: React.Dispatch<React.SetStateAction<T>>;
	close?: () => void;
};

export type PortalProps = React.PropsWithChildren<{
	id?: string;
	open: boolean;
	key?: string;
}>;

export const Portal: React.FC<PortalProps> = ({
	id = "modal",
	open,
	key,
	children,
}: PortalProps) => {
	if (typeof window === "undefined") return null;
	let container = document.getElementById(id);
	if (!container) {
		container = document.createElement("div");
		container.id = id;
		container.className = "bg-dark bg-opacity-80";
		document.body.append(container);
	}

	return open ? ReactDOM.createPortal(children, container, key) : null;
};

// Returns the Modal and show / hide in an array, to make renaming easier, in case of multiple Modals in the same component
export function useModal(): [
	React.FC<ModalProps<undefined>>,
	() => void,
	() => void
];
export function useModal<T>(): [
	React.FC<ModalProps<T>>,
	(item: T) => void,
	() => void
];
export function useModal<T>(): [
	React.FC<ModalProps<T>>,
	(item: T) => void,
	() => void
] {
	const toggles = useRef<Toggles<T>>();

	const Modal = useCallback(
		({ onConfirm, onClose, children, buttonText, imgUrl }: ModalProps<T>) => {
			const [open, setOpen] = useState(false);
			const [item, setItem] = useState<T | undefined>();

			const close = () => {
				if (onClose) onClose(item!);
				setOpen(false);
			};
			const confirm = () => {
				if (onConfirm) onConfirm(item!);
				setOpen(false);
			};

			toggles.current = { setOpen, setItem: setItem as any, close };

			const handleKeydown = (e: KeyboardEvent) => {
				if (open) {
					e.preventDefault();
					e.stopPropagation();
					if (e.key === "Escape") close();
					if (e.key === "Enter") confirm();
				}
			};
			useEffect(() => {
				window.addEventListener("keydown", handleKeydown);
				return () => window.removeEventListener("keydown", handleKeydown);
			}, [handleKeydown]);

			return (
				<Portal id="modal" open={open}>
					<ModalBG onBgClick={close}>
						<div className="p-6 pt-10">
							{imgUrl && (
								<div className="relative mb-5 h-[100px] w-full">
									<NextImage
										src={imgUrl}
										priority
										height={100}
										width={100}
										alt={buttonText || ""}
									/>
								</div>
							)}

							<div className="mb-6 mt-6 text-center">{children}</div>

							{buttonText && onConfirm && (
								<Button content={buttonText} fullWidth onClick={confirm} />
							)}
						</div>

						<div
							className="absolute right-3 top-3 md:cursor-pointer"
							onClick={close}
						>
							<Clear className="h-8 w-8 stroke-dark" />
						</div>
					</ModalBG>
				</Portal>
			);
		},
		[]
	);

	return [
		Modal,
		useCallback((item: T) => {
			// need to wrap functions before putting them into React state
			toggles.current?.setItem(typeof item === "function" ? () => item : item);
			toggles.current?.setOpen(true);
		}, []),
		useCallback(() => {
			if (toggles.current?.close) toggles.current.close();
		}, []),
	];
}
interface ModalBGProps {
	children: React.ReactNode;
	onBgClick?: () => void;
}

export const ModalBG: React.FC<ModalBGProps> = (props: ModalBGProps) => {
	return (
		<div
			className={`absolute left-0 top-0 h-screen w-screen bg-black bg-opacity-80`}
			style={{ zIndex: 9999 }} //No tailwind for this - bug with zIndex
			onClick={props.onBgClick}
			tabIndex={-1}
		>
			<div
				className="absolute left-[50%] top-[45%] min-h-[25%] w-11/12 translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-lg bg-white shadow md:top-[50%] md:w-5/12"
				// Avoid closing the modal when we click here (otherwise propagates to the backdrop)
				onClick={(event) => event.stopPropagation()}
			>
				{props.children}
			</div>
		</div>
	);
};
