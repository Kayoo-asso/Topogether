import { useRef } from "react";
import { useSprings, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { arrayMove } from "helpers/utils";

// export default function move(array: any[], moveIndex: number, toIndex: number) {
// 	/* #move - Moves an array item from one position in an array to another.
//      Note: This is a pure function so a new array will be returned, instead
//      of altering the array argument.
//     Arguments:
//     1. array     (String) : Array in which to move an item.         (required)
//     2. moveIndex (Object) : The index of the item to move.          (required)
//     3. toIndex   (Object) : The index to move item at moveIndex to. (required)
//   */
// 	const item = array[moveIndex];
// 	const length = array.length;
// 	const diff = moveIndex - toIndex;

// 	if (diff > 0) {
// 		// move left
// 		return [
// 			...array.slice(0, toIndex),
// 			item,
// 			...array.slice(toIndex, moveIndex),
// 			...array.slice(moveIndex + 1, length),
// 		];
// 	} else if (diff < 0) {
// 		// move right
// 		const targetIndex = toIndex + 1;
// 		return [
// 			...array.slice(0, moveIndex),
// 			...array.slice(moveIndex + 1, targetIndex),
// 			item,
// 			...array.slice(targetIndex, length),
// 		];
// 	}
// 	return array;
// }

const clamp = (num: number, min: number, max: number) =>
	Math.min(Math.max(num, min), max);

const fn =
	(order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
	(index: number) =>
		active && index === originalIndex
			? {
					y: curIndex + y,
					order: -1,
					scale: 1.1,
					zIndex: 1,
					shadow: 15,
					immediate: (key: string) => key === "zIndex",
					config: (key: string) =>
						key === "y" ? config.stiff : config.default,
			  }
			: {
					y: order.indexOf(index) * 30,
					order: order.indexOf(index),
					scale: 1,
					zIndex: 0,
					shadow: 1,
					immediate: false,
			  };

export const DraggableList = ({ items }: { items: JSX.Element[] }) => {
	const order = useRef(items.map((_, index) => index)); // Store indicies as a local ref, this represents the item order
	
	const [springs, api] = useSprings(items.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
	
	const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
		const curIndex = order.current.indexOf(originalIndex);
		const curRow = clamp(
			Math.round((curIndex * 100 + y) / 100),
			0,
			items.length - 1
		);
		const newOrder = arrayMove(order.current, curIndex, curRow);
		api.start(fn(newOrder, active, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
		if (!active) order.current = newOrder;
	});

	return (
		<div className="flex h-full flex-col">
			{springs.map( ({ zIndex, shadow, y, scale, order }, i) => (
				<animated.div
					{...bind(i)}
					key={i}
					style={{
						zIndex,
						y,
						scale,
						order,
					}}
					children={items[i]}
				/>
			))}
		</div>
	);
};

DraggableList.displayName = "Draggable List";