import SpotlightCard from "./CardAnimation/SpotlightCard";

export default function ChoosePathCard({ contentOpacity = 1 }) {
    return (
        <SpotlightCard
            className="w-full h-full"
            bgColor="#E3F2FD"
            contentOpacity={contentOpacity}
        >
            <div className="max-w-200">
                <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[1.05] mb-10 uppercase text-gray-900">
                    Choose Your Path
                </h1>
                <h2 className="text-sm md:text-base font-semibold tracking-[3px] mb-5 text-gray-700 uppercase">
                    Subtitle for Card 2
                </h2>
            </div>
        </SpotlightCard>
    );
}
