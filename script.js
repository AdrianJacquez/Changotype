const $time = document.querySelector("time");
const $input = document.querySelector("input");
const $paragraph = document.querySelector("p");

const starTime = 30;
const text =
  "recuerda siempre que la paz interior proviene de tus propios pensamientos no es lo que te sucede sino como reaccionas ante lo que te sucede lo que determina tu serenidad no te permitas ser perturbado por cosas fuera de tu control en lugar de eso concentrate en manejar tus propias acciones y actitudes todo lo demas es simplemente una distraccion";

let words = [];
let currentTime = starTime;

/*LLAMAMOS A LAS FUNCIONES*/
initGame();
initEvents();

// FUNCION PARA INICIAR JUEGO
function initGame() {
  words = text.split(" ").slice(0, 60);

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
