import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";
import NavBar from "../NavBar";

test("renders NavBar", () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );

    // screen.debug();
    const signInLink = screen.getByRole("link", { name: "Sign in" }); // Methods that start with “get” are for synchronous code.
    expect(signInLink).toBeInTheDocument();
});

// we’ll need the callback function to be asynchronous because our test...
// ...will be fetching data and we’ll need to await changes in the document.
test("renders link to the user profile for a logged in user", async () => {
    /* 
        Console error about a state update on an unmounted component:
            The reason for that is the CurrentUserProvider is fetching currentUser details,
            but we’re not awaiting any UI changes in our test,
            so JEST moves on to the next test without waiting for the request and state update to finish.
            (no await function)
            
            As we need to target elements that aren’t there on mount, because they appear as a result of an async
            function, we should use one of the find query methods with the await keyword.
    */
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );

    const profileAvatar = await screen.findByText("Profile");
    expect(profileAvatar).toBeInTheDocument();
});

test("renders Sign in and Sign up buttons again on log out", async () => {
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );

    const signOutLink = await screen.findByRole("link", { name: "Sign out" });
    fireEvent.click(signOutLink);
    const signInLink = await screen.findByRole("link", { name: "Sign in" });
    const signUpLink = await screen.findByRole("link", { name: "Sign up" });
    
    expect(signUpLink).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
});
