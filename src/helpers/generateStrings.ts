export function generateStrings() {
  const ALPHABET_LETTERS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const randomCase = (w: string) => {
    const randomizer = Math.floor(Math.random() * 2);
    const c = randomizer === 0 ? w.toLowerCase() : w.toUpperCase();
    return c;
  };

  const LENGTH = 2000000;
  const WORD_LEN = 100;

  let res: Array<string> = [];
  let hundred = "";
  for (let a = 0; a < LENGTH; a++) {
    hundred = "";
    for (let b = 0; b < WORD_LEN; b++) {
      hundred = hundred.concat(
        randomCase(
          ALPHABET_LETTERS[Math.floor(Math.random() * ALPHABET_LETTERS.length)]
        )
      );
    }
    res = [...res, hundred];
    return res;
  }
}
