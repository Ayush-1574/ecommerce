import superadminReducer, {
  fetchSuperadminStats,
  fetchAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser,
} from "@/store/superadmin-slice";
import { describe, test, expect } from "vitest";

describe("superadminSlice Reducer", () => {
  const initialState = {
    isLoading: false,
    users: [],
    stats: null,
    error: null,
  };

  test("should return initial state", () => {
    expect(superadminReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("fetchSuperadminStats extraReducers", () => {
    test("handles fetchSuperadminStats.pending", () => {
      const state = superadminReducer(initialState, fetchSuperadminStats.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles fetchSuperadminStats.fulfilled", () => {
      const payload = { data: { totalUsers: 10 } };
      const state = superadminReducer({ ...initialState, isLoading: true }, fetchSuperadminStats.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.stats).toEqual(payload.data);
    });

    test("handles fetchSuperadminStats.rejected", () => {
      const state = superadminReducer({ ...initialState, isLoading: true }, { type: fetchSuperadminStats.rejected.type, payload: "Error" });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Error");
    });
  });

  describe("fetchAllUsers extraReducers", () => {
    test("handles fetchAllUsers.pending", () => {
      const state = superadminReducer(initialState, fetchAllUsers.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles fetchAllUsers.fulfilled", () => {
      const payload = { data: [{ id: "1" }] };
      const state = superadminReducer({ ...initialState, isLoading: true }, fetchAllUsers.fulfilled(payload));
      expect(state.isLoading).toBe(false);
      expect(state.users).toEqual(payload.data);
    });

    test("handles fetchAllUsers.rejected", () => {
      const state = superadminReducer({ ...initialState, isLoading: true }, { type: fetchAllUsers.rejected.type, payload: "Error" });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Error");
    });
  });

  describe("createAdminUser extraReducers", () => {
    test("handles createAdminUser.fulfilled", () => {
      const payload = { data: { id: "2" } };
      const state = superadminReducer({ ...initialState, users: [{ id: "1" }] }, createAdminUser.fulfilled(payload));
      expect(state.users.length).toBe(2);
      expect(state.users[0].id).toBe("2");
    });
  });

  describe("updateUserRole extraReducers", () => {
    test("handles updateUserRole.fulfilled", () => {
      const payload = { data: { id: "1", role: "admin" } };
      const state = superadminReducer({ ...initialState, users: [{ id: "1", role: "user" }] }, updateUserRole.fulfilled(payload));
      expect(state.users[0].role).toBe("admin");
    });
  });

  describe("deleteUser extraReducers", () => {
    test("handles deleteUser.fulfilled", () => {
      const payload = { id: "1" };
      const state = superadminReducer({ ...initialState, users: [{ id: "1" }, { id: "2" }] }, deleteUser.fulfilled(payload));
      expect(state.users.length).toBe(1);
      expect(state.users[0].id).toBe("2");
    });
  });
});
