import { fetchNewWords, fetchReviewWords } from "../repositories/wordRepository";
import { saveNewWordDecision, saveReviewProgress } from "../repositories/progressRepository";

export const LearningMode = {
  NEW: "new",
  REVIEW: "review",
};

export const fetchLearningWords = async ({ userId, languageId, mode }) => {
  if (!userId) return [];

  if (mode === LearningMode.NEW) {
    return fetchNewWords({ userId, languageId });
  }

  return fetchReviewWords({ userId, languageId });
};

export const applySwipeResult = ({ wordId, quality, userId, mode }) => {
  if (!wordId || !userId) return;

  if (mode === LearningMode.REVIEW) {
    saveReviewProgress({ wordId, quality, userId });
    return;
  }

  saveNewWordDecision({ wordId, quality, userId });
};
