import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../components/Register";

test("renders Register component", () => {
  render(<Register onRegister={jest.fn()} />);

  expect(screen.getByText(/Register/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Register/i)).toBeInTheDocument();
});

test("allows user to type in input fields", () => {
  render(<Register onRegister={jest.fn()} />);

  const nameInput = screen.getByPlaceholderText(/Full Name/i);
  fireEvent.change(nameInput, { target: { value: "John Doe" } });
  expect(nameInput.value).toBe("John Doe");

  const emailInput = screen.getByPlaceholderText(/Email/i);
  fireEvent.change(emailInput, { target: { value: "john@example.com" } });
  expect(emailInput.value).toBe("john@example.com");

  const passwordInput = screen.getByPlaceholderText(/Password/i);
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  expect(passwordInput.value).toBe("password123");
});

test("calls onRegister function when form is submitted", () => {
  const mockRegister = jest.fn();
  render(<Register onRegister={mockRegister} />);

  fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "john@example.com" } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password123" } });

  fireEvent.click(screen.getByText(/Register/i));

  expect(mockRegister).toHaveBeenCalledWith({
    fullName: "John Doe",
    email: "john@example.com",
    password: "password123",
  });
});