import { useEffect, useMemo, useState } from "react";
import { processTextFile } from "../../utils/fileReader";

export default function YoutubeQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [objectsArray, setObjectsArray] = useState([]);
  const [constructedSentence, setConstructedSentence] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [inputIndex, setInputIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const [clickedWords, setClickedWords] = useState([]);

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
        .map((word, index) => ({ word, id: index }))
        .sort(() => Math.random() - 0.5) || [],
    [objectsArray, questionIndex]
  );

  const handleWordClick = (wordObj) => {
    setConstructedSentence([...constructedSentence, wordObj.word]);
    setClickedWords([...clickedWords, wordObj.id]);
  };

  const handleCheckSentence = () => {
    const sentence = constructedSentence.join(" ");
    if (sentence === objectsArray[questionIndex].example) {
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const handleNextQuestion = () => {
    const index =
      inputIndex && parseInt(inputIndex, 10) !== questionIndex
        ? parseInt(inputIndex, 10)
        : questionIndex + 1;
    if (index < objectsArray.length) {
      setQuestionIndex(index);
      setInputIndex(index);
    }
    setConstructedSentence([]);
    setFeedback("");
    setClickedWords([]);
  };

  const handleClearSentence = () => {
    setConstructedSentence([]);
    setClickedWords([]);
  };

  return (
    <div className="p-4 flex flex-col justify-between min-h-screen pb-10">
      <div className="flex flex-col gap-4">
        <div className="font-semibold">
          #{questionIndex}: {objectsArray[questionIndex]?.meaning}
        </div>
        <div className="relative p-4 border rounded h-56">
          {constructedSentence.join(" ")}
          <button
            onClick={handleClearSentence}
            className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded text-sm"
          >
            X
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
          {shuffledWords.map((wordObj) => (
            <button
              key={wordObj.id}
              className={`px-3 py-2 border rounded ${
                clickedWords.includes(wordObj.id) ? "bg-neutral-200" : ""
              }`}
              onClick={() => handleWordClick(wordObj)}
            >
              {wordObj.word}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
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
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Check
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className={`px-4 py-2 text-white rounded w-32 ${
                  feedback === "correct"
                    ? "bg-green-500"
                    : feedback
                    ? "bg-red-500"
                    : ""
                }`}
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
