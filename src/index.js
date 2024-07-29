import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Pdf from "./routes/pdf";
import Words from "./routes/words";
import Quiz from "./routes/quiz";
import Youtube from "./routes/youtube";
import YoutubeQuiz from "./routes/youtube/quiz";
import Xxxx from "./routes/xxxx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/pdf",
    element: <Pdf />,
  },
  {
    path: "/youtube",
    element: <Youtube />,
  },
  {
    path: "/youtube/quiz",
    element: <YoutubeQuiz />,
  },
  {
    path: "/xxxx",
    element: <Xxxx />,
  },
  {
    path: "/:quizIndex",
    element: <Words />,
  },
  {
    path: "/:quizIndex/quiz",
    element: <Quiz />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
