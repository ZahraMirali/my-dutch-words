import { Link, useParams } from "react-router-dom";
import { dutch } from "../duolingo";

export default function Words() {
  const { quizIndex } = useParams();
  const currentList = dutch[quizIndex];

  if (!currentList) return null;

  return (
    <div className="max-w-screen-md mx-auto mt-4 p-2">
      <Link
        to="quiz"
        className="block w-full bg-blue-500 text-white py-2 rounded-md text-center hover:bg-blue-700 mb-4"
      >
        Start Quiz
      </Link>
      <ul className="grid grid-cols-1 gap-4">
        {currentList.words.map((word, index) => (
          <li
            key={index}
            className="bg-white border p-4 rounded-md hover:bg-gray-100"
          >
            <strong className="text-blue-500">{word.word}</strong>:{" "}
            {word.meaning}
          </li>
        ))}
      </ul>
    </div>
  );
}
