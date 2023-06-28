// Testing custom hooks

import * as React from "react";
import { render, screen, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useCounter from "../hooks/useCounter";

// There is a situation when we can create a test component that uses the hook to be tested and then we render the test component and test the hook functionality indirectly by interacting with the component:
function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

test("exposes the count and increment/decrement functions", async () => {
  render(<Counter />);

  const message = screen.getByText(/current count: 0/i);
  const decrementButton = screen.getByRole("button", { name: "Decrement" });
  const incrementButton = screen.getByRole("button", { name: "Increment" });

  // We assert on the initial state of the hook
  expect(message).toHaveTextContent(/current count: 0/i);

  // We interact with the UI using userEvent and assert on the changes in the UI
  await userEvent.click(decrementButton);
  expect(message).toHaveTextContent(/current count: -1/i);
  await userEvent.click(incrementButton);
  expect(message).toHaveTextContent(/current count: 0/i);
});

// Of course there are edge cases where it is extremely difficult to create a test component just to test a custom hook, or we want to test some initial values in that hook. That is when @testing-library/react-hooks comes to the rescue!
test("exposes the count and increment/decrement functions with the use of renderHook()", () => {
  const { result } = renderHook(useCounter);
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});

test("allows customization of the initial count", () => {
  const { result } = renderHook(useCounter, {
    initialProps: { initialCount: 3 },
  });
  expect(result.current.count).toBe(3);
  act(() => result.current.increment());
  expect(result.current.count).toBe(4);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(3);
});

test("allows customization of the step", () => {
  const { result } = renderHook(useCounter, { initialProps: { step: 2 } });
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(2);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});

test("allows the step to be changed along the way", () => {
  const { result, rerender } = renderHook(useCounter, {
    initialProps: { step: 3 },
  });
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(3);
  rerender({ step: 2 });
  act(() => result.current.decrement());
  expect(result.current.count).toBe(1);
});
