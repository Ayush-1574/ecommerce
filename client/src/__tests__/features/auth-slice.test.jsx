import authReducer, { registerUser, loginUser, logoutUser, checkAuth } from "@/store/auth-slice";
import { describe, test, expect } from "vitest";

describe("authSlice Reducer", () => {
  const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
  };

  test("should return initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("registerUser extraReducers", () => {
    test("handles registerUser.pending", () => {
      const state = authReducer(initialState, registerUser.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles registerUser.fulfilled", () => {
      const state = authReducer({ ...initialState, isLoading: true }, registerUser.fulfilled());
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    test("handles registerUser.rejected", () => {
      const state = authReducer({ ...initialState, isLoading: true }, registerUser.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe("loginUser extraReducers", () => {
    test("handles loginUser.pending", () => {
      const state = authReducer(initialState, loginUser.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles loginUser.fulfilled on success", () => {
      const payload = { success: true, user: { id: "1", name: "John" } };
      const state = authReducer({ ...initialState, isLoading: true }, loginUser.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual({ id: "1", name: "John" });
    });

    test("handles loginUser.fulfilled on failure payload", () => {
      const payload = { success: false };
      const state = authReducer({ ...initialState, isLoading: true }, loginUser.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    test("handles loginUser.rejected", () => {
      const state = authReducer({ ...initialState, isLoading: true }, loginUser.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe("checkAuth extraReducers", () => {
    test("handles checkAuth.pending", () => {
      const state = authReducer(initialState, checkAuth.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles checkAuth.fulfilled on success", () => {
      const payload = { success: true, user: { id: "1", name: "John" } };
      const state = authReducer({ ...initialState, isLoading: true }, checkAuth.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual({ id: "1", name: "John" });
    });

    test("handles checkAuth.fulfilled on failure", () => {
      const payload = { success: false };
      const state = authReducer({ ...initialState, isLoading: true }, checkAuth.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    test("handles checkAuth.rejected", () => {
      const state = authReducer({ ...initialState, isLoading: true }, checkAuth.rejected());
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe("logoutUser extraReducers", () => {
    test("handles logoutUser.fulfilled", () => {
      const authenticatedState = {
        isAuthenticated: true,
        isLoading: false,
        user: { id: "1", name: "John" },
      };
      const state = authReducer(authenticatedState, logoutUser.fulfilled());
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });
});
