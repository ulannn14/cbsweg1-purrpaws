import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

        {/* Logo */}
        <div className="logo">
            <img src="/images/logo.png" alt="PurrPaws Logo" />
        </div>

        {/* Navigation */}
        <nav className="nav">

            <Link to="/" className="nav-item">
            <img src="/images/icons/shelter.png" alt="Home" />
            </Link>

            <Link to="/applications" className="nav-item">
            <img src="/images/icons/application.png" alt="Applications" />
            </Link>

            <Link to="/profile" className="nav-item">
            <img src="/images/icons/profile.png" alt="Profile" />
            </Link>

        </nav>

        </aside>
    );
}

export default Sidebar;