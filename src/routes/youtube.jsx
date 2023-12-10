import { useEffect, useState } from "react";
import { processTextFile } from "../utils/fileReader";
import { difficultWords } from "../utils/difficultWords";

export default function Youtube() {
  const [objectsArray, setObjectsArray] = useState([]);
  const [exampleCount, setExampleCount] = useState(1);
  const [showWord, setShowWord] = useState(true);
  const [meaningPosition, setMeaningPosition] = useState(1);
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [selectedWords, setSelectedWords] = useState(difficultWords);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cleanWord = (word) => {
    return word.replace(/[^a-zA-Z0-9]+$/, "");
  };

  const handleWordClick = (word, index) => {
    const separator = selectedWord ? " " : "";
    setSelectedWord(`${selectedWord}${separator}${cleanWord(word)}`);
    setSelectedWordIndex(index);
  };

  const handleMeaningClick = (meaning) => {
    if (!selectedWord) return;
    const separator = selectedWord.includes(":") ? " " : " : ";
    setSelectedWord(`${selectedWord}${separator}${cleanWord(meaning)}`);
  };

  const onAddClick = () => {
    setSelectedWords([...selectedWords, selectedWord]);
    setSelectedWord("");
    setSelectedWordIndex(null);
  };

  useEffect(() => {
    async function initializeState() {
      const processedArray = await processTextFile();
      setObjectsArray(processedArray);
    }
    initializeState();
  }, []);

  const handleExampleCountChange = (event) => {
    const count = parseInt(event.target.value);
    setExampleCount(Math.max(count, 0));
  };

  const handleShowWordChange = (event) => {
    setShowWord(event.target.checked);
  };

  const handleMeaningPositionChange = (event) => {
    const position = parseInt(event.target.value);
    setMeaningPosition(position);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const copyToClipboard = () => {
    const repeatedWords = selectedWords.flatMap((word) =>
      Array.from({ length: 3 }, () => word)
    );
    const textToCopy = repeatedWords.join("\n");
    navigator.clipboard.writeText(textToCopy);
    setIsModalOpen(false);
  };

  const handleRemoveWord = (indexToRemove) => {
    const updatedWords = selectedWords.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedWords(updatedWords);
  };

  return (
    <div>
      {isModalOpen && (
        <div
          className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white py-1 px-2 rounded overflow-y-auto max-h-full min-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedWords.map((word, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-1"
              >
                <p>{word}</p>
                <button
                  onClick={() => handleRemoveWord(index)}
                  className="text-red-500"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="2"
                      y1="10"
                      x2="18"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={copyToClipboard}
              className="bg-violet-500 text-white py-1 px-2 rounded mt-2"
            >
              Copy 3x
            </button>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-10 bg-white flex gap-4 flex-wrap w-full py-2 shadow-md border-b border-gray-300 hidden md:flex">
        <button
          className="w-7 h-7 rounded-full bg-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
          onClick={openModal}
        >
          {selectedWords.length}
        </button>
        <label>
          Repeat Example Counts:
          <input
            type="number"
            value={exampleCount}
            onChange={handleExampleCountChange}
            className="border border-gray-300 p-1 rounded ml-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>
        <label>
          Meaning Position:
          <input
            type="number"
            value={meaningPosition}
            onChange={handleMeaningPositionChange}
            className="border border-gray-300 p-1 rounded ml-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showWord}
            onChange={handleShowWordChange}
            className="rounded border-gray-300"
          />
          <span>Show Word</span>
        </label>
      </div>
      <ul className="p-4">
        {objectsArray?.map((object, index) => {
          const meaning = (
            <div key={`meaning_${index}`} className="mt-2">
              {object.meaning.split(" ").map((mean, mi) => (
                <span key={`meaning_${index}_${mi}`}>
                  <span
                    className="hover:bg-blue-200 rounded cursor-pointer"
                    onClick={() => handleMeaningClick(mean)}
                  >
                    {mean}
                  </span>{" "}
                </span>
              ))}
            </div>
          );

          return (
            <li key={index} className="mb-4">
              {showWord && object.word && (
                <div className="font-bold">{object.word}</div>
              )}
              {Array.from({ length: exampleCount }, (_, i) => {
                return (
                  <div key={`example_${index}_${i}`}>
                    {i === meaningPosition && meaning}
                    <div className="mt-2">
                      {object.example.split(" ").map((ex, exi) => {
                        const cleanedWord = cleanWord(ex).toLowerCase();
                        const isSelected = selectedWords.some(
                          (selectedWord) => {
                            return (
                              cleanWord(
                                selectedWord.split(" :")[0]
                              ).toLowerCase() === cleanedWord
                            );
                          }
                        );

                        return (
                          <span key={`example_${index}_${i}_${exi}`}>
                            <span
                              className={`rounded cursor-pointer hover:bg-blue-200 ${
                                isSelected ? "bg-purple-200" : ""
                              }`}
                              onClick={() =>
                                handleWordClick(ex, `${index}_${i}`)
                              }
                            >
                              {ex}
                            </span>{" "}
                          </span>
                        );
                      })}
                      {selectedWordIndex === `${index}_${i}` && (
                        <span>
                          <input
                            type="text"
                            value={selectedWord}
                            onChange={(e) => setSelectedWord(e.target.value)}
                            className="rounded-md border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500 ml-4 h-8"
                          />
                          <button
                            onClick={onAddClick}
                            className="rounded-md p-1 ml-2 bg-violet-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {meaningPosition >= exampleCount && meaning}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
