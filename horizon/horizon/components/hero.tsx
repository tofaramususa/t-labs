interface HeroProps {
	children: React.ReactNode;
}
interface HeroElementProps {
	children: React.ReactNode;
}
export const HeroTitle = ({children} : HeroElementProps) => {
	return <h1 className="text-gradient text-6xl my-6 md:text-8xl">{children}</h1>
}


export const HeroSubtitle = ({children} : HeroElementProps) => {
	return <h1 className="text-lg md:text-xl mb-12 text-primary-text">{children}</h1>
}

export const Hero = ({ children }: HeroProps) => {
	return (
		<div className=" text-center">
			{ children }
		</div>
	)
}