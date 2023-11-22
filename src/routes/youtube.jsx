import { useEffect, useState } from "react";
import { processTextFile } from "../utils/fileReader";

export default function Youtube() {
  const [objectsArray, setObjectsArray] = useState([]);
  const [exampleCount, setExampleCount] = useState(1);
  const [meaningCount, setMeaningCount] = useState(1);
  const [showWord, setShowWord] = useState(true);

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

  const handleMeaningCountChange = (event) => {
    const count = parseInt(event.target.value);
    setMeaningCount(Math.max(count, 0));
  };

  const handleShowWordChange = (event) => {
    setShowWord(event.target.checked);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4">
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
          Repeat Meaning Counts:
          <input
            type="number"
            value={meaningCount}
            onChange={handleMeaningCountChange}
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
        {objectsArray?.map((object, index) => (
          <li key={index} className="mb-4">
            {showWord && object.word && (
              <div className="font-bold">{object.word}</div>
            )}
            {Array.from({ length: exampleCount }, (_, i) => (
              <div key={`example_${index}_${i}`} className="mt-2">
                {object.example}
              </div>
            ))}
            {Array.from({ length: meaningCount }, (_, i) => (
              <div key={`meaning_${index}_${i}`} className="mt-2">
                {object.meaning}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
