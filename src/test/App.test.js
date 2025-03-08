import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/",
  }),
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ path, element }) => <div path={path}>{element}</div>,
}));
/*
// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));*/

test("renders App without crashing", () => {
  render(<App />);
});