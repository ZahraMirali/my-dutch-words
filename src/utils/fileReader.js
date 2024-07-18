export const processTextFile = async () => {
  return new Promise((resolve) => {
    fetch("/youtube.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((fileContent) => {
        try {
          const lines = fileContent.split(/\n\s*\n/);

          const objectsArray = [];

          for (let i = 0; i < lines.length; i++) {
            const internalLines = lines[i].split("\n");
            const line1 = internalLines[0].trim();
            const line2 = internalLines[1];
            const line3 = internalLines[2]?.trim();

            if (line1 && line2 && line3) {
              const obj = { word: line1, example: line2, meaning: line3 };
              objectsArray.push(obj);
            } else if (line1 && line2) {
              const obj = { example: line1, meaning: line2 };
              objectsArray.push(obj);
            }
          }

          resolve(objectsArray);
        } catch (err) {}
      })
      .catch(() => {});
  });
};
