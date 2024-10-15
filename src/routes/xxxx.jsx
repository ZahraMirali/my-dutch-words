export default function Xxxx() {
  const startDate = "2024-07-26";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const dates = Array.from({ length: 9 }, (_, i) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 26 * i);
    return formatDate(newDate);
  });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">List of Dates</h1>
      <ul className="list-disc pl-5 space-y-4">
        {dates.map((date, index) => (
          <li key={index} className="text-lg text-gray-700">
            {date}
          </li>
        ))}
      </ul>
    </div>
  );
}
