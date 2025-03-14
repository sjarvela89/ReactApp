import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, expect } from "vitest";
import { vi } from 'vitest';
import Login from "./Login";

vi.stubGlobal('fetch', vi.fn());     

test("renders login form", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});

test("shows error message for failed login", async () => {
    // Arrange: Mock the fetch call to simulate an error response
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Login failed' }), // Simulate error message
    });

    render(<Login />);

    // Simulate user input for username and password
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongPass' } });

    // Simulate clicking the Login button
    fireEvent.click(screen.getByText('LoginButton'));

    // Wait for the error message to be displayed
    await waitFor(() => {
        const errorMessage = screen.getByText('Login failed'); // Expect the error message
        expect(errorMessage).toBeInTheDocument(); // Verify that the error message is rendered
    });
});

test("shows success message for successful login", async () => {
    // Arrange: Mock the fetch call to simulate a successful login response
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true, // Indicating the response is successful
        json: async () => ({ token: 'validToken', requiresMfa: true }), // Simulated response with a token
    });

    render(<Login />);

    // Simulate user input for username and password
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'validUser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validPass' } });

    // Simulate clicking the Login button
    fireEvent.click(screen.getByText('LoginButton'));

    // Wait for the login to be successful and the token to be set
    await waitFor(() => {
        // Verify that the window redirects or the login state changes (e.g., "You are logged in")
        const loggedInMessage = screen.getByText('Enter MFA Code');
        expect(loggedInMessage).toBeInTheDocument();
    });

    // Optionally, check that the localStorage has the token set
    //expect(localStorage.getItem("token")).toBe("validToken");
});