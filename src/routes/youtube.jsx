import { useEffect, useState } from "react";
import { processTextFile } from "../utils/fileReader";

export default function Youtube() {
  const [objectsArray, setObjectsArray] = useState([]);
  const [exampleCount, setExampleCount] = useState(1);
  const [showWord, setShowWord] = useState(true);
  const [meaningPosition, setMeaningPosition] = useState(1);
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);

  const cleanWord = (word) => {
    return word.replace(/[^a-zA-Z]+$/, "");
  };

  const handleWordClick = (word, index) => {
    setSelectedWord(`${selectedWord} ${cleanWord(word)}`);
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

  return (
    <div className="p-4">
      <div className="flex gap-4 flex-wrap">
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
      <br />
      <ul className="mt-4">
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
                      {object.example.split(" ").map((ex, exi) => (
                        <span key={`example_${index}_${i}_${exi}`}>
                          <span
                            className={`rounded cursor-pointer ${
                              selectedWord === ex &&
                              selectedWordIndex === `${index}_${i}`
                                ? "bg-blue-200"
                                : "hover:bg-blue-200"
                            }`}
                            onClick={() => handleWordClick(ex, `${index}_${i}`)}
                          >
                            {ex}
                          </span>{" "}
                        </span>
                      ))}
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
      <br />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Selected Words</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Word</th>
              <th className="border border-gray-300 px-4 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {selectedWords.map((selected, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-4 py-2">
                  {selected.word}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {selected.meaning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
