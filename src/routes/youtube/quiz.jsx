import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { processTextFile } from "../../utils/fileReader";

export default function YoutubeQuiz() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [objectsArray, setObjectsArray] = useState([]);
  const [constructedSentence, setConstructedSentence] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const questionIndex = parseInt(searchParams.get("questionIndex"), 10) || 0;
  const [inputIndex, setInputIndex] = useState(questionIndex);
  const [isChecked, setIsChecked] = useState(true);
  const [clickedWords, setClickedWords] = useState([]);
  const [randomMode, setRandomMode] = useState(false);

  useEffect(() => {
    async function initializeState() {
      const processedArray = await processTextFile();
      setObjectsArray(processedArray);
    }
    initializeState();
  }, []);

  const shuffledWords = useMemo(() => {
    if (!objectsArray[questionIndex]) return [];

    const currentWords = objectsArray[questionIndex].example
      .split(" ")
      .map((word, index) => ({ word, id: `${questionIndex}-${index}` }));

    const otherWords = objectsArray
      .flatMap((obj, index) =>
        index !== questionIndex
          ? obj.example
              .split(" ")
              .map((word) => ({ word, id: `${index}-${word}` }))
          : []
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [...currentWords, ...otherWords].sort(() => Math.random() - 0.5);
  }, [objectsArray, questionIndex]);

  const handleWordClick = (wordObj) => {
    setConstructedSentence([...constructedSentence, wordObj]);
    setClickedWords([...clickedWords, wordObj.id]);
  };

  const handleCheckSentence = () => {
    const sentence = constructedSentence
      .map((wordObj) => wordObj.word)
      .join(" ")
      .toLowerCase();
    if (sentence === objectsArray[questionIndex].example.toLowerCase()) {
      setFeedback("correct");
    } else {
      setFeedback("wrong");
      setWrongAnswers((prev) => [...prev, questionIndex]);
    }
  };

  const handleNextQuestion = () => {
    const index = randomMode
      ? Math.floor(Math.random() * objectsArray.length)
      : inputIndex && parseInt(inputIndex, 10) !== questionIndex
      ? parseInt(inputIndex, 10)
      : questionIndex + 1;

    if (index < objectsArray.length) {
      setSearchParams({ questionIndex: index });
      setInputIndex(index);
      setConstructedSentence([]);
      setFeedback("");
      setClickedWords([]);
    }
  };

  const handleRemoveWord = (id) => {
    const newSentence = constructedSentence.filter(
      (wordObj) => wordObj.id !== id
    );
    setConstructedSentence(newSentence);
    setClickedWords(clickedWords.filter((clickedId) => clickedId !== id));
  };

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col justify-between pb-16 gap-4">
        <div className="bg-white shadow-md rounded-lg p-2 flex flex-col gap-4">
          <div className="font-semibold text-gray-800">
            #{questionIndex}: {objectsArray[questionIndex]?.meaning}
          </div>
          <div className="flex flex-wrap gap-4 border border-gray-300 rounded-lg bg-gray-100 p-2 min-h-[57px]">
            {constructedSentence.map((wordObj) => (
              <button
                key={wordObj.id}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => handleRemoveWord(wordObj.id)}
              >
                {wordObj.word}
              </button>
            ))}
          </div>
          {feedback && (
            <div
              className={`text-lg font-semibold ${
                feedback === "correct" ? "text-green-600" : "text-red-600"
              }`}
            >
              {objectsArray[questionIndex]?.example}
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-2 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            {shuffledWords.map((wordObj) => (
              <button
                key={wordObj.id}
                className={`px-4 py-2 border rounded-lg ${
                  clickedWords.includes(wordObj.id)
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                } shadow focus:outline-none focus:ring-2 focus:ring-blue-300`}
                disabled={clickedWords.includes(wordObj.id)}
                onClick={() => handleWordClick(wordObj)}
              >
                {wordObj.word}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="form-checkbox h-5 w-5"
              />
              <input
                type="checkbox"
                checked={randomMode}
                onChange={() => setRandomMode(!randomMode)}
                className="form-checkbox h-5 w-5 accent-pink-500"
              />
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                className="px-3 py-2 border rounded-lg w-20 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={inputIndex}
                onChange={(e) => setInputIndex(e.target.value)}
              />
              {isChecked && !feedback ? (
                <button
                  onClick={handleCheckSentence}
                  className="w-20 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Check
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className={`w-20 px-4 py-2 text-white rounded-lg shadow ${
                    feedback === "correct"
                      ? "bg-green-500 hover:bg-green-600"
                      : feedback
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                >
                  Go
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-800 mb-4">
            {wrongAnswers.length} Wrong Answers
          </div>
          <ul className="space-y-4">
            {wrongAnswers.map((index, i) => (
              <li
                key={i}
                className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
              >
                <div className="text-lg font-semibold text-gray-900">
                  #{index}
                </div>
                <div className="text-gray-600 mt-1">
                  {objectsArray[index]?.meaning}
                </div>
                <div className="text-gray-700 mt-1">
                  {objectsArray[index]?.example}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
