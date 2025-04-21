import { useEffect, useState } from "react";
import { processTextFile } from "../utils/fileReader";

export default function Youtube() {
  const [objectsArray, setObjectsArray] = useState([]);
  const [exampleCount, setExampleCount] = useState(1);
  const [showWord, setShowWord] = useState(true);
  const [meaningPosition, setMeaningPosition] = useState(1);

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
    <div>
      <div className="sticky top-0 z-10 bg-white gap-4 flex-wrap w-full py-2 shadow-md border-b border-gray-300 hidden md:flex">
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
                        return (
                          <span key={`example_${index}_${i}_${exi}`}>
                            <span
                              className="rounded cursor-pointer hover:bg-blue-200">
                              {ex}
                            </span>{" "}
                          </span>
                        );
                      })}
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
