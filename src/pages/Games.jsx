import ChoosePathCard from "@/Advitya26Components/ChoosePathCardDir/ChoosePathCard";
import { GlobalNavbar } from "@/Advitya26Components/Navbar";

function Games() {
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-[10vh] z-50">
                <GlobalNavbar />
            </div>
            <div className="pt-[10vh] min-h-screen bg-gradient-to-br from-[#d2b48c] via-[#c19a6b] to-[#d2b48c]">
                <ChoosePathCard />
            </div>
        </>
    );
}

export default Games;