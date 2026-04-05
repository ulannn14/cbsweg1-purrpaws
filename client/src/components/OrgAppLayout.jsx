import OrgSidebar from "./OrgSidebar";
import FloatingPopup from "./FloatingPopup";

function OrgAppLayout({ children }) {
    return (
        <div className="app-layout">

        <OrgSidebar/>

        <FloatingPopup
            title="Adoption Tips"
            redirectTo="/pets"
            forUser={false} 
        />

        <main className="main">
            {children}
        </main>

        </div>
    );
}

export default OrgAppLayout;