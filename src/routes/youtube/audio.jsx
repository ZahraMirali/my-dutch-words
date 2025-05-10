import { useEffect, useRef, useState } from "react";

export default function YoutubeAudio() {
  const audioRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [segments, setSegments] = useState([]);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [segmentTime, setSegmentTime] = useState(0);

  const SEGMENT_LENGTH = 300; // هر بخش ۵ دقیقه

  const audioFiles = [{ label: "فایل ۱", src: "/audio/1.mp3" }];

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
  }, [audioFile]);

  const playSegment = (segment) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentSegment(segment);
    setIsPlaying(true);
    setSegmentTime(0);
    audio.currentTime = segment.start;
    audio.play();
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSegment) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e) => {
    const audio = audioRef.current;
    if (!audio || !currentSegment) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = currentSegment.start + newTime;
    setSegmentTime(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!currentSegment) return;

      const current = audio.currentTime;
      if (current >= currentSegment.end) {
        audio.pause();
        setTimeout(() => {
          audio.currentTime = currentSegment.start;
          audio.play();
        }, 1000);
        return;
      }
      setSegmentTime(current - currentSegment.start);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentSegment]);

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <div className="p-4 max-w-xl w-full bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-center">انتخاب فایل صوتی</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {audioFiles.map((file, index) => (
            <button
              key={index}
              onClick={() => {
                setAudioFile(file.src);
                setSegments([]);
                setCurrentSegment(null);
                setIsPlaying(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              {file.label}
            </button>
          ))}
        </div>
      </div>

      {audioFile && (
        <div className="p-6 max-w-xl w-full bg-white rounded-2xl shadow-md">
          {/* Hidden audio element */}
          <audio ref={audioRef} src={audioFile} className="hidden" />

          {segments.map((seg, index) => (
            <div
              key={index}
              className="w-full p-4 border rounded-xl shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span>{seg.label}</span>
                <button
                  onClick={() =>
                    currentSegment?.start === seg.start
                      ? togglePlayPause()
                      : playSegment(seg)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  {isPlaying && currentSegment?.start === seg.start
                    ? "Pause"
                    : "Play"}
                </button>
              </div>
              {currentSegment?.start === seg.start && (
                <input
                  type="range"
                  min="0"
                  max={seg.end - seg.start}
                  step="0.1"
                  value={segmentTime}
                  onChange={handleSliderChange}
                  className="w-full"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
