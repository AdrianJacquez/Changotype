import { words as startWords } from "./data.js";

const $time = document.querySelector("time");
const $input = document.querySelector("input");
const $paragraph = document.querySelector("p");

const starTime = 30;

let words = [];
let currentTime = starTime;

/*LLAMAMOS A LAS FUNCIONES*/
initGame();
initEvents();

// FUNCION PARA INICIAR JUEGO
function initGame() {
  words = startWords.toSorted(() => Math.random() - 0.5).slice(0, 32);
  console.log(words);

  currentTime = starTime;

  $time.textContent = currentTime;
  $paragraph.innerHTML = words
    .map((word, index) => {
      const letters = word.split("");

      return `<x-word>
    ${letters.map((letter) => `<y-letter>${letter}<y-/letter>`).join("")}
    </x-word>`;
    })
    .join("");

  const intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;

    if (currentTime === 0) {
      clearInterval(intervalId);
      console.log("GAME OVER");
    }
  }, 1000);

  const $firstWord = $paragraph.querySelector("x-word");
  $firstWord.classList.add("active");
  $firstWord.querySelector("y-letter").classList.add("active");
}

//FUNCION PARA INICIAR EVENTOS
function initEvents() {
  document.addEventListener("keydown", () => {
    $input.focus();
  });
  $input.addEventListener("keydown", onKeyDown);
  $input.addEventListener("keyup", onKeyUp);
}

function onKeyDown(event) {
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("y-letter.active");

  const { key } = event;
  if (key === " ") {
    event.preventDefault();

    const $nextWord = $currentWord.nextElementSibling;
    const $nextLetter = $nextWord.querySelector("y-letter");

    $currentWord.classList.remove("active");
    $currentLetter.classList.remove("active");

    $nextWord.classList.add("active");
    $nextLetter.classList.add("active");

    $input.value = "";

    const hasMissedLetters =
      $currentWord.querySelectorAll("y-letter:not(.correct)").length > 0;

    const classToAdd = hasMissedLetters ? "marked" : "correct";
    $currentWord.classList.add(classToAdd);
    return;
  }

  if (key === "Backspace") {
    const $prevWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter.previousElementSibling;

    if (!$prevWord && !$prevLetter) {
      event.preventDefault();
      return;
    }

    const $wordMarked = $paragraph.querySelector("x-word.marked");
    if ($wordMarked && !$prevLetter) {
      event.preventDefault();
      $prevWord.classList.remove("marked");
      $prevWord.classList.add("active");

      const $letterToGo = $prevWord.querySelector("y-letter:last-child");

      $currentLetter.classList.remove("active");
      $letterToGo.classList.add("active");

      $input.value = [
        ...$prevWord.querySelectorAll("y-letter.correct, y-letter.incorrect"),
      ]
        .map(($el) => {
          return $el.classList.contains("correct") ? $el.innerText : "*";
        })
        .join("");
    }
  }
}

function onKeyUp() {
  const $currentWord = $paragraph.querySelector("x-word.active");
  const $currentLetter = $currentWord.querySelector("y-letter.active");

  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;
  console.log({ value: $input.value, currentWord });

  const $allLetters = $currentWord.querySelectorAll("y-letter");

  $allLetters.forEach(($letter) =>
    $letter.classList.remove("correct", "incorrect")
  );

  $input.value.split("").forEach((char, index) => {
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];

    const isCorrect = char === letterToCheck;
    const letterClass = isCorrect ? "correct" : "incorrect";
    $letter.classList.add(letterClass);
  });

  $currentLetter.classList.remove("active", "is-last");
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    $currentLetter.classList.add("active", "is-last");
  }
}
