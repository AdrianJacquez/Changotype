const $time = document.querySelector("time");
const $input = document.querySelector("input");
const $paragraph = document.querySelector("p");
const $game = document.querySelector('#game');
const $results = document.querySelector('#results');
const $wpm = document.querySelector('#results-wpm');
const $accuracy = $results.querySelector('#results-accuracy');
const $reloadB = document.querySelector('#reloadB');

const starTime = 30;
const text = [
    "virtud", "sabiduria", "templanza", "coraje", "justicia", "disciplina",
    "tranquilidad", "apatheia", "ataraxia", "eudaimonia", "logos", "destino",
    "razon", "moralidad", "prudencia", "determinismo", "indiferencia", "naturaleza",
    "autocontrol", "resiliencia", "serenidad", "equilibrio", "aceptacion",
    "impermanencia", "perspectiva", "fortaleza", "altruismo", "compasion",
    "estoicismo", "humanidad", "humildad", "integridad", "etica", "gratitud",
    "tolerancia", "paciencia", "ecuanimidad", "responsabilidad", "reflexion",
    "sabio", "bueno", "malo", "accion", "percepcion", "juicio", "valor",
    "esfuerzo", "autonomia", "libertad", "voluntad", "firmeza", "armonia",
    "simplicidad", "contento", "moderacion", "rectitud", "meditacion",
    "benevolencia", "caridad", "composicion", "calma", "honor", "lealtad",
    "dignidad", "caracter", "constancia", "igualdad", "fuerza de voluntad",
    "calma", "pensamiento", "persistencia", "amabilidad", "frugalidad",
    "paz", "fortaleza", "alegria", "logica", "conciencia", "honestidad",
    "enfoque", "resistencia", "autosuficiencia", "kaizen", "mementomori"
];


let words = [];
let currentTime = starTime;

/*LLAMAMOS A LAS FUNCIONES*/
initGame();
initEvents();

// FUNCION PARA INICIAR JUEGO
function initGame() {
  $game.style.display = 'flex'
  $results.style.display = 'none'
  $input.value = '';

  words = text.toSorted(
    () => Math.random() - 0.5
  ).slice(0, 30);

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
      gameOver();
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
  $reloadB.addEventListener('click', initGame)
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

function gameOver(){
$game.style.display = 'none'
$results.style.display = 'flex'

const correctWords = $paragraph.querySelectorAll('x-word.correct').length
const correctLetter = $paragraph.querySelectorAll('y-letter.correct').length
const incorrectLetter = $paragraph.querySelectorAll('y-letter.incorrect').length

const totalLetters = correctLetter + incorrectLetter
const accuracy = totalLetters > 0
?(correctLetter / totalLetters) * 100
: 0

const wpm = correctWords * 60 / starTime
$wpm.textContent = wpm
$accuracy.textContent = `${accuracy.toFixed(2)}%`
}
