import { Footer } from "../footer-section";
import { CpuArchitecture } from "../ui/cpu-architecture";

export function FooterSection() {
	return (
		<div className="relative flex flex-col items-center w-full bg-transparent">
			<Footer />
			<div className="w-full flex justify-center items-center mt-4 mb-2">
				<CpuArchitecture className="mx-auto max-w-[480px] w-full h-auto" />
			</div>
		</div>
	);
}
