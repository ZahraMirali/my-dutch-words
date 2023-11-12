const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateRandomQuestions = (list) => {
  if (!list) return [];
  const questions = list.words.map((wordObj) => {
    const question = {
      question: wordObj.meaning,
      answer: wordObj.word,
      options: [],
    };

    question.options.push(wordObj.word);

    const maxOptions = Math.min(4, list.words.length) - 1;
    for (let i = 0; i < maxOptions; i++) {
      let randomIndex = Math.floor(Math.random() * list.words.length);
      while (
        question.options.includes(list.words[randomIndex].word) ||
        question.answer === list.words[randomIndex].word
      ) {
        randomIndex = Math.floor(Math.random() * list.words.length);
      }
      question.options.push(list.words[randomIndex].word);
    }

    question.options = shuffleArray(question.options);

    return question;
  });

  return shuffleArray(questions);
};
