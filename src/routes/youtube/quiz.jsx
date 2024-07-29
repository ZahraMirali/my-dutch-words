import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { processTextFile } from "../../utils/fileReader";

export default function YoutubeQuiz() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [objectsArray, setObjectsArray] = useState([]);
  const [constructedSentence, setConstructedSentence] = useState([]);
  const [feedback, setFeedback] = useState("");
  const questionIndex = parseInt(searchParams.get("questionIndex"), 10) || 0;
  const [inputIndex, setInputIndex] = useState(questionIndex);
  const [isChecked, setIsChecked] = useState(true);
  const [clickedWords, setClickedWords] = useState([]);

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
    }
  };

  const handleNextQuestion = () => {
    const index =
      inputIndex && parseInt(inputIndex, 10) !== questionIndex
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
    <div className="p-2 flex flex-col justify-between min-h-screen pb-16">
      <div className="flex flex-col gap-4">
        <div className="font-semibold">
          #{questionIndex}: {objectsArray[questionIndex]?.meaning}
        </div>
        <div className="flex flex-wrap gap-2 rounded border h-40 items-start p-2">
          {constructedSentence.map((wordObj) => (
            <button
              key={wordObj.id}
              className="px-3 py-2 border rounded"
              onClick={() => handleRemoveWord(wordObj.id)}
            >
              {wordObj.word}
            </button>
          ))}
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
              disabled={clickedWords.includes(wordObj.id)}
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
                className="px-4 py-2 bg-blue-500 text-white rounded w-32"
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
                    : "bg-blue-500"
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
