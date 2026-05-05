import { useCallback, useEffect, useMemo, useState } from "react";
import { applySwipeResult, fetchLearningWords, LearningMode } from "./learningService";

const FETCH_INTERVAL_MS = 10000;

export default function useLearningCards({ userId, languageID }) {
  const [cards, setCards] = useState([]);
  const [mode, setMode] = useState(LearningMode.NEW);
  const [noWordsForNew, setNoWordsForNew] = useState(false);
  const [noWordsForReview, setNoWordsForReview] = useState(false);

  const fetchWords = useCallback(async () => {
    const words = await fetchLearningWords({
      userId,
      languageId: languageID,
      mode,
    });

    setCards(words);
    setNoWordsForNew(mode === LearningMode.NEW && words.length === 0);
    setNoWordsForReview(mode === LearningMode.REVIEW && words.length === 0);
  }, [userId, languageID, mode]);

  const onSwipe = useCallback(
    (cardIndex, quality) => {
      const word = cards[cardIndex];
      if (!word) return;

      applySwipeResult({
        wordId: word.WordID,
        quality,
        userId,
        mode,
      });

      if (cardIndex === cards.length - 1) {
        fetchWords();
      }
    },
    [cards, userId, mode, fetchWords]
  );

  useEffect(() => {
    fetchWords();
    const interval = setInterval(fetchWords, FETCH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchWords]);

  const isEmptyState = useMemo(() => cards.length === 0, [cards.length]);

  return {
    cards,
    mode,
    setMode,
    noWordsForNew,
    noWordsForReview,
    fetchWords,
    onSwipe,
    isEmptyState,
  };
}
