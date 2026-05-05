import {
  updateWordProgress,
  markWordAsLearned,
  markWordAsKnown,
  markWordAsLearning,
} from "../database/db";

export const saveReviewProgress = ({ wordId, quality, userId }) => {
  updateWordProgress(wordId, quality, userId);

  if (quality >= 4) {
    markWordAsLearned(wordId, userId);
  }
};

export const saveNewWordDecision = ({ wordId, quality, userId }) => {
  if (quality === 5) {
    markWordAsKnown(wordId, userId);
    return;
  }

  markWordAsLearning(wordId, userId);
};
