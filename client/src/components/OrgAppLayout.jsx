import OrgSidebar from "./OrgSidebar";

function OrgAppLayout({ children }) {
    return (
        <div className="app-layout">

        <OrgSidebar/>

        <main className="main">
            {children}
        </main>

        </div>
    );
}

export default OrgAppLayout;