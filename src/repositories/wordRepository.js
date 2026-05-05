import { getNewWordsForCurrentUser, getWordsForReview } from "../database/db";

const getWordsWithCallback = (queryFn, { userId, languageId }) =>
  new Promise((resolve) => {
    queryFn(userId, languageId, (words) => {
      resolve(Array.isArray(words) ? words : []);
    });
  });

export const fetchNewWords = ({ userId, languageId }) =>
  getWordsWithCallback(getNewWordsForCurrentUser, { userId, languageId });

export const fetchReviewWords = ({ userId, languageId }) =>
  getWordsWithCallback(getWordsForReview, { userId, languageId });
