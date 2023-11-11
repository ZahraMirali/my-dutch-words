import { Link } from "react-router-dom";
import { dutch } from "../duolingo";

export default function Root() {
  return (
    <div className="max-w-screen-md mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">List</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {dutch.map((adverb, index) => (
          <Link
            key={index}
            to={`/${index}`}
            className="bg-white p-4 border border-gray-300 rounded-md transition-all hover:border-blue-500 hover:shadow-md text-blue-500 font-semibold"
          >
            {adverb.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
