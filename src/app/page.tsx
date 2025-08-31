import { HeroSection } from "@/components/home/hero-section";

export const revalidate = 1800;

export default function Page() {
	return (
		<div className="min-h-screen">
			<HeroSection />
		</div>
	);
}
