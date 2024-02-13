import { NavLink  } from "react-router-dom";
import { useAuth } from './useAuth';

const AfterLoginMenu = () => {
    return (
        <>
        <li><NavLink  to="/account/dashboard">Dashboard</NavLink ></li>
        <li><NavLink  to="/account/user-blogs">User Blogs</NavLink ></li>
        <li><NavLink  to="/chat">Chat</NavLink ></li>
        <li><NavLink  to="/auth/logout">Logout</NavLink ></li>
        </>
    )
}
const BeforeLoginMenu = () => {
    return (
        <li><NavLink  to="/auth/login">Login</NavLink ></li>
    )
}

const HeaderMenu = () => {
    const isLoggedIn = useAuth();
    let headerMenu = '';
    if(isLoggedIn) {
        headerMenu = <AfterLoginMenu/>
    } else {
        headerMenu = <BeforeLoginMenu/>
    }

    return (
        <div className="top-headsec">
            <ul className="top-menu">
                <li><NavLink  to="/">Home</NavLink ></li>                
                {headerMenu}
            </ul>
        </div>
    );
};

export default HeaderMenu;
