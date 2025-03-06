export const getRandomColor = () => {
  // Replaces each '0' in the string '#000000' with a random hexadecimal digit (0-9, a-f).
  // Generates a random number between 0 and 15, converts it to a hexadecimal string, and substitutes it.
  return '#000000'.replace(/0/g, function () {
    return Math.floor(Math.random() * 16).toString(16);
  });
};
