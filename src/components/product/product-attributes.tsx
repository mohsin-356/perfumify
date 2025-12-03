"use client";
import cn from "classnames";
interface Props {
	className?: string;
	title: string;
	attributes: {
		id: number;
		value: string;
		meta: string;
	}[];
	active: string;
	onClick: any;
}

export const ProductAttributes: React.FC<Props> = ({
	className = "mb-4",
	title,
	attributes,
	active,
	onClick,
}) => {
	return (
		<div className={className}>
			<h3 className="text-sm font-semibold text-heading mb-2 capitalize">
				{title}
			</h3>
			<ul className="colors flex flex-wrap gap-2">
				{attributes?.map(({ id, value, meta }) => (
					<li
						key={`${value}-${id}`}
						className={cn(
							"cursor-pointer rounded border border-gray-300 px-4 py-2 flex justify-center items-center text-heading text-sm font-medium transition duration-200 ease-in-out hover:border-black",
							{
								"border-black bg-gray-50": value === active,
							}
						)}
						onClick={() => onClick({ [title]: value })}
					>
						{title === "color" ? (
							<span
								className="h-full w-full rounded block"
								style={{ backgroundColor: meta }}
							/>
						) : (
							value
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
