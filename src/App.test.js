import { render, screen } from "@testing-library/react";
import App from "./App";

test("renderiza login", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});
