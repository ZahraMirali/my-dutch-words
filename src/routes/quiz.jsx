import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { dutch } from "../duolingo";
import { generateRandomQuestions, shuffleArray } from "../utils";

export default function Quiz() {
  const { quizIndex } = useParams();

  const questions = useMemo(() => {
    const selectedLists = quizIndex
      .split(",")
      .map((index) => parseInt(index, 10));
    const questionsForSelectedLists = selectedLists.map((listIndex) => {
      const currentList = dutch[listIndex];
      return generateRandomQuestions(currentList);
    });

    const shuffledQuestions = shuffleArray(...questionsForSelectedLists);
    return shuffledQuestions;
  }, [quizIndex]);

  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wrongAnswersIndices, setWrongAnswersIndices] = useState([]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const answer = currentQuestion.answer;
    const isCorrect = answer === option;

    if (!isCorrect) {
      setWrongAnswersIndices((prevWrongAnswers) => [
        ...prevWrongAnswers,
        currentQuestionIndex,
      ]);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 1000);
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-screen-md mx-auto mt-4 p-2">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-500">
          Your Score: {questions.length - wrongAnswersIndices.length}/
          {questions.length}
        </h1>
        <h2 className="text-2xl text-gray-500 my-2">Incorrect Answers:</h2>
        <ul className="list-disc">
          {wrongAnswersIndices.map((wrongAnswerIndex) => (
            <li
              key={wrongAnswerIndex}
              className="text-white bg-red-500 p-2 mb-2 rounded-md"
            >
              {questions[wrongAnswerIndex].answer}:{" "}
              {questions[wrongAnswerIndex].question}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto mt-4 p-2">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {currentQuestion.question}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            disabled={selectedOption}
            onClick={() => handleOptionClick(option)}
            className={`border border-gray-300 p-4 rounded-md cursor-pointer ${
              selectedOption && option === currentQuestion.answer
                ? "bg-green-500 text-white"
                : option === selectedOption
                ? "bg-red-500 text-white"
                : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
