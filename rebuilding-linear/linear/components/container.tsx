import classNames from "classnames";  //allows the component to take in additional classnames

export const Container = ({ children, className }: {
	children: React.ReactNode;
	className?: string;
 }) => {
	return <div className={classNames("max-w-[120rem] mx-auto px-8", className)}>
		{children}
		</div>
}