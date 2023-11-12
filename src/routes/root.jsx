import { Link } from "react-router-dom";
import { dutch } from "../duolingo";

export default function Root() {
  return (
    <div className="max-w-screen-md mx-auto mt-4 p-2">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {dutch.map((list, index) => (
          <Link
            key={index}
            to={`/${index}`}
            className="bg-white p-4 border border-gray-300 rounded-md transition-all hover:border-blue-500 hover:shadow-md text-blue-500 font-semibold"
          >
            {list.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
