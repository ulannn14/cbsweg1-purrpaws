import { Link } from "react-router-dom";

function OrgSidebar() {
    return (
        <aside className="sidebar">

        {/* Logo */}
        <div className="logo">
            <img src="/images/logo.png" alt="PurrPaws Logo" />
        </div>

        {/* Navigation */}
        <nav className="nav">

            <Link to="/org" className="nav-item">
            <img src="/images/icons/orgapplication.png" alt="Applications" />
            </Link>

            <Link to="/org/pets" className="nav-item">
            <img src="/images/icons/orgshelter.png" alt="Home" />
            </Link>

            <Link to="/org/profile" className="nav-item">
            <img src="/images/icons/profile.png" alt="Profile" />
            </Link>

        </nav>

        </aside>
    );
}

export default OrgSidebar;