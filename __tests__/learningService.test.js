jest.mock("../src/repositories/wordRepository", () => ({
  fetchNewWords: jest.fn(),
  fetchReviewWords: jest.fn(),
}));

jest.mock("../src/repositories/progressRepository", () => ({
  saveNewWordDecision: jest.fn(),
  saveReviewProgress: jest.fn(),
}));

import { fetchNewWords, fetchReviewWords } from "../src/repositories/wordRepository";
import { saveNewWordDecision, saveReviewProgress } from "../src/repositories/progressRepository";
import { applySwipeResult, fetchLearningWords, LearningMode } from "../src/services/learningService";

describe("learningService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array when userId is missing", async () => {
    const result = await fetchLearningWords({ userId: null, languageId: 1, mode: LearningMode.NEW });
    expect(result).toEqual([]);
    expect(fetchNewWords).not.toHaveBeenCalled();
  });

  it("fetches new words in NEW mode", async () => {
    fetchNewWords.mockResolvedValue([{ WordID: 1 }]);
    const result = await fetchLearningWords({ userId: "u1", languageId: 1, mode: LearningMode.NEW });
    expect(fetchNewWords).toHaveBeenCalledWith({ userId: "u1", languageId: 1 });
    expect(result).toEqual([{ WordID: 1 }]);
  });

  it("fetches review words in REVIEW mode", async () => {
    fetchReviewWords.mockResolvedValue([{ WordID: 2 }]);
    const result = await fetchLearningWords({ userId: "u1", languageId: 2, mode: LearningMode.REVIEW });
    expect(fetchReviewWords).toHaveBeenCalledWith({ userId: "u1", languageId: 2 });
    expect(result).toEqual([{ WordID: 2 }]);
  });

  it("routes swipe result to review progress in REVIEW mode", () => {
    applySwipeResult({ wordId: 10, quality: 4, userId: "u1", mode: LearningMode.REVIEW });
    expect(saveReviewProgress).toHaveBeenCalledWith({ wordId: 10, quality: 4, userId: "u1" });
    expect(saveNewWordDecision).not.toHaveBeenCalled();
  });

  it("routes swipe result to new-word decision in NEW mode", () => {
    applySwipeResult({ wordId: 11, quality: 5, userId: "u1", mode: LearningMode.NEW });
    expect(saveNewWordDecision).toHaveBeenCalledWith({ wordId: 11, quality: 5, userId: "u1" });
    expect(saveReviewProgress).not.toHaveBeenCalled();
  });
});
