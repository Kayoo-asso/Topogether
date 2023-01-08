import React from "react";

const cleanPercentage = (percentage: number) => {
	const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
	const isTooHigh = percentage > 100;
	return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

interface CircleProps { percentage: number; color: string, size: number }
const Circle = (props: CircleProps) => {
	const r = props.size/2 -3;
	const circ = 2 * Math.PI * r;
	const strokePct = ((100 - props.percentage) * circ) / 100; // where stroke will start, e.g. from 15% to 100%.
	return (
	  <circle
		r={r}
		cx={props.size/2}
		cy={props.size/2}
		fill="transparent"
		stroke={strokePct !== circ ? props.color : ""} // remove colour as 0% sets full circumference
		strokeWidth={props.size/10}
		strokeDasharray={circ}
		strokeDashoffset={props.percentage ? strokePct : 0}
	  ></circle>
	);
};

interface TextProps { percentage: number, size: number }
const Text = (props: TextProps) => {
	return (
	  <text
		x="50%"
		y="50%"
		dominantBaseline="central"
		textAnchor="middle"
		fontSize={props.size/6}
	  >
		{props.percentage.toFixed(0)}%
	  </text>
	);
};

interface RoundProgressBarProps {
	percentage: number;
	size?: number;
	color?: string;
	displayLabel?: boolean;
	onClick?: () => void;
}
export const RoundProgressBar: React.FC<RoundProgressBarProps> = ({ 
	color = '#04D98B',
	size = 22,
	displayLabel = true,
	...props 
}: RoundProgressBarProps) => {
	const pct = cleanPercentage(props.percentage);
	return (
		<svg width={size} height={size} onClick={props.onClick} className={props.onClick ? 'cursor-pointer' : ''}>
			<g transform={`rotate(-90 ${size/2 + " " + size/2})`}>
				<Circle color="#E8EAF0" percentage={100} size={size} />
				<Circle color={color} percentage={pct} size={size} />
			</g>
			{displayLabel && <Text percentage={pct} size={size} />}
		</svg>
	);
};

RoundProgressBar.displayName = 'RoundProgressBar';