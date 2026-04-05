import Sidebar from "./Sidebar";
import FloatingPopup from "./FloatingPopup";

function AppLayout({ children }) {
    return (
        <div className="app-layout">

        <Sidebar />

        <FloatingPopup
            title="Adoption Tips"
            redirectTo="/pets"
            forUser={true} 
        />

        <main className="main">
            {children}
        </main>

        </div>
    );
}

export default AppLayout;