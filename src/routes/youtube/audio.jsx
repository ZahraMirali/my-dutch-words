import { useEffect, useRef, useState } from "react";

export default function YoutubeAudio() {
  const audioRef = useRef(null);
  const [segments, setSegments] = useState([]);
  const [currentSegment, setCurrentSegment] = useState(null);

  const SEGMENT_LENGTH = 300;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const total = Math.floor(audio.duration);

      const parts = [];
      for (let i = 0; i < total; i += SEGMENT_LENGTH) {
        parts.push({
          label: `Part ${Math.floor(i / SEGMENT_LENGTH) + 1}`,
          start: i,
          end: Math.min(i + SEGMENT_LENGTH, total),
        });
      }
      setSegments(parts);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const playSegment = (segment) => {
    console.log(segment);
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentSegment(segment);
    audio.currentTime = segment.start;
    audio.play();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (currentSegment && audio.currentTime >= currentSegment.end) {
        audio.pause();
        setTimeout(() => {
          audio.currentTime = currentSegment.start;
          audio.play();
        }, 1000);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentSegment]);

  return (
    <div className="flex flex-col items-center p-4 overflow-y-auto h-screen">
      <div className="p-6 max-w-xl bg-white rounded-2xl shadow-md">
        <audio ref={audioRef} controls className="w-full">
          <source src="/audio/1.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="flex flex-wrap gap-2">
          {segments.map((seg, index) => (
            <button
              key={index}
              onClick={() => playSegment(seg)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              {seg.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
