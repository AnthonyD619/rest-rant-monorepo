import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';  // Use 'react-router-dom' for routing
import { CurrentUserContext, CurrentUserContextType } from './contexts/CurrentUser'; // Update import according to your actual context setup

// Define types for currentUser
interface CurrentUser {
    firstName: string;
    lastName: string;
}

// Define types for context
interface CurrentUserContextType {
    currentUser: CurrentUser | null;
}

const Navigation: React.FC = () => {
    const history = useHistory();
    const { currentUser } = useContext(CurrentUserContext) as CurrentUserContextType;

    let loginActions: JSX.Element = (
        <>
            <li style={{ float: 'right' }}>
                <a href="#" onClick={() => history.push("/sign-up")}>
                    Sign Up
                </a>
            </li>
            <li style={{ float: 'right' }}>
                <a href="#" onClick={() => history.push("/login")}>
                    Login
                </a>
            </li>
        </>
    );

    if (currentUser) {
        loginActions = (
            <li style={{ float: 'right' }}>
                Logged in as {currentUser.firstName} {currentUser.lastName}
            </li>
        );
    }

    return (
        <nav>
            <ul>
                <li>
                    <a href="#" onClick={() => history.push("/")}>
                        Home
                    </a>
                </li>
                <li>
                    <a href="#" onClick={() => history.push("/places")}>
                        Places
                    </a>
                </li>
                <li>
                    <a href="#" onClick={() => history.push("/places/new")}>
                        Add Place
                    </a>
                </li>
                {loginActions}
            </ul>
        </nav>
    );
};

export default Navigation;
