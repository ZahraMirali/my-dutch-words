import { useEffect, useMemo, useState } from "react";
import { processTextFile } from "../../utils/fileReader";

export default function YoutubeQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [objectsArray, setObjectsArray] = useState([]);
  const [constructedSentence, setConstructedSentence] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [inputIndex, setInputIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    async function initializeState() {
      const processedArray = await processTextFile();
      setObjectsArray(processedArray);
    }
    initializeState();
  }, []);

  const shuffledWords = useMemo(
    () =>
      objectsArray[questionIndex]?.example
        .split(" ")
        .sort(() => Math.random() - 0.5) || [],
    [objectsArray, questionIndex]
  );

  const handleWordClick = (word) => {
    setConstructedSentence([...constructedSentence, word]);
  };

  const handleCheckSentence = () => {
    const sentence = constructedSentence.join(" ");
    if (sentence === objectsArray[questionIndex].example) {
      setFeedback("Correct!");
    } else {
      setFeedback("Try again.");
    }
  };

  const handleNextQuestion = () => {
    const index =
      inputIndex && parseInt(inputIndex, 10) !== questionIndex
        ? parseInt(inputIndex, 10)
        : questionIndex + 1;
    if (index < objectsArray.length - 1) {
      setQuestionIndex(index);
      setInputIndex(index);
    }
    setConstructedSentence([]);
    setFeedback("");
  };

  const handleClearSentence = () => {
    setConstructedSentence([]);
  };

  return (
    <div className="p-4 flex flex-col justify-between min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="font-semibold">
          #{questionIndex}: {objectsArray[questionIndex]?.meaning}
        </div>
        <div className="relative p-4 border rounded h-56">
          {constructedSentence.join(" ")}
          <button
            onClick={handleClearSentence}
            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
        {feedback && (
          <div className="font-semibold">
            {objectsArray[questionIndex]?.example}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map((word, index) => (
            <button
              key={index}
              className="px-3 py-2 border rounded hover:bg-gray-200"
              onClick={() => handleWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>

        <div
          className={`font-semibold h-6 self-start px-3 rounded text-white ${
            feedback === "Correct!"
              ? "bg-green-500"
              : feedback
              ? "bg-red-500"
              : ""
          }`}
        >
          {feedback}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label className="ml-2">Check?</label>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              className="px-2 py-1 border rounded w-32"
              value={inputIndex}
              onChange={(e) => setInputIndex(e.target.value)}
            />
            {isChecked && !feedback ? (
              <button
                onClick={handleCheckSentence}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-32"
              >
                Check
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-32"
              >
                Go
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
