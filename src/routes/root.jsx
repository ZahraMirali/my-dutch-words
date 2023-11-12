import { useState } from "react";
import { Link } from "react-router-dom";
import { dutch } from "../duolingo";

export default function Root() {
  const [selectedLists, setSelectedLists] = useState([]);
  const isStartQuizActive = selectedLists.length > 0;

  const handleCheckboxChange = (index) => {
    if (selectedLists.includes(index)) {
      setSelectedLists(
        selectedLists.filter((selectedIndex) => selectedIndex !== index)
      );
    } else {
      setSelectedLists([...selectedLists, index]);
    }
  };

  const handleDeselectAll = () => {
    setSelectedLists([]);
  };

  return (
    <div className="max-w-screen-md mx-auto mt-4 p-2">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isStartQuizActive}
          onChange={handleDeselectAll}
          className="mr-2 h-9 w-9"
          disabled={!isStartQuizActive}
        />
        <Link
          to={isStartQuizActive ? `/${selectedLists.join()}/quiz` : ""}
          className={`block w-full py-2 rounded-md text-center ${
            isStartQuizActive
              ? "bg-blue-500 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-500 text-gray-700 cursor-auto"
          }`}
        >
          Start Quiz for {selectedLists.length} list(s)
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {dutch.map((list, index) => {
          const selected = selectedLists.includes(index);
          return (
            <Link
              key={index}
              to={isStartQuizActive ? "" : `/${index}`}
              className="bg-white p-4 border border-gray-300 rounded-md transition-all hover:border-blue-500 hover:shadow-md text-blue-500 font-semibold relative group"
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => handleCheckboxChange(index)}
                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 ${
                  selected && "opacity-100"
                }`}
                onClick={(e) => e.stopPropagation()}
              />
              {list.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
