import commonReducer, {
  getFeatureImages,
  addFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import { describe, test, expect } from "vitest";

describe("commonSlice Reducer", () => {
  const initialState = {
    isLoading: false,
    featureImageList: [],
  };

  test("should return initial state", () => {
    expect(commonReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("getFeatureImages extraReducers", () => {
    test("handles getFeatureImages.pending", () => {
      const state = commonReducer(initialState, getFeatureImages.pending());
      expect(state.isLoading).toBe(true);
    });

    test("handles getFeatureImages.fulfilled", () => {
      const payload = { data: [{ id: "1", image: "img1.png" }] };
      const state = commonReducer(
        { ...initialState, isLoading: true },
        getFeatureImages.fulfilled(payload)
      );
      expect(state.isLoading).toBe(false);
      expect(state.featureImageList).toEqual(payload.data);
    });

    test("handles getFeatureImages.rejected", () => {
      const state = commonReducer(
        { ...initialState, isLoading: true },
        getFeatureImages.rejected()
      );
      expect(state.isLoading).toBe(false);
      expect(state.featureImageList).toEqual([]);
    });
  });

  describe("addFeatureImage extraReducers", () => {
    test("handles addFeatureImage.fulfilled", () => {
      const payload = { data: { id: "1", image: "img1.png" } };
      const state = commonReducer(initialState, addFeatureImage.fulfilled(payload));
      expect(state.featureImageList.length).toBe(1);
      expect(state.featureImageList[0].id).toBe("1");
    });
  });

  describe("deleteFeatureImage extraReducers", () => {
    test("handles deleteFeatureImage.fulfilled", () => {
      const payload = { id: "1" };
      const state = commonReducer(
        { ...initialState, featureImageList: [{ id: "1" }, { id: "2" }] },
        deleteFeatureImage.fulfilled(payload)
      );
      expect(state.featureImageList.length).toBe(1);
      expect(state.featureImageList[0].id).toBe("2");
    });
  });
});
