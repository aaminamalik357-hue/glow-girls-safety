
const levels = [
  {
    title: "Online Privacy",
    badge: "🔐 Privacy Protector",
    questions: [
      {
        q: "Should you share your password with an online stranger?",
        options: ["Yes", "No", "Only once"],
        answer: 1
      },
      {
        q: "What should you do with a suspicious link?",
        options: ["Open it quickly", "Share it", "Avoid it and check with a trusted adult"],
        answer: 2
      },
      {
        q: "Which information should stay private?",
        options: ["Your password", "Your favourite colour", "A public school subject"],
        answer: 0
      },
      {
        q: "What makes a password safer?",
        options: ["Using your name only", "A long, unique password", "Using 123456"],
        answer: 1
      }
    ]
  },
  {
    title: "Cyberbullying & Boundaries",
    badge: "💜 Kindness Champion",
    questions: [
      {
        q: "Someone sends you hurtful messages. What can you do?",
        options: ["Reply with insults", "Save evidence, block and report them", "Share your password"],
        answer: 1
      },
      {
        q: "What is a good online boundary?",
        options: ["Saying no when uncomfortable", "Accepting every request", "Sharing every secret"],
        answer: 0
      },
      {
        q: "A stranger asks for your private photo. What should you do?",
        options: ["Send it", "Ask for their photo first", "Do not send it and tell a trusted adult"],
        answer: 2
      },
      {
        q: "What should you do if online bullying continues?",
        options: ["Keep it secret forever", "Ask a trusted adult for help", "Blame yourself"],
        answer: 1
      }
    ]
  },
  {
    title: "Public & Travel Safety",
    badge: "🌷 Smart Traveller",
    questions: [
      {
        q: "What is a safer way to travel somewhere?",
        options: ["Tell a trusted adult your plan", "Go with a stranger", "Ignore your route"],
        answer: 0
      },
      {
        q: "If you feel unsafe in public, what can you do?",
        options: ["Follow the person", "Move to a staffed public place and seek help", "Go somewhere isolated"],
        answer: 1
      },
      {
        q: "Who should know your travel plan?",
        options: ["Only an online stranger", "Nobody ever", "A trusted adult"],
        answer: 2
      },
      {
        q: "Someone you do not know offers you a ride. What is safer?",
        options: ["Accept immediately", "Decline and contact your trusted adult", "Get in if they seem friendly"],
        answer: 1
      }
    ]
  },
  {
    title: "Smart Digital Choices",
    badge: "✨ Digital Star",
    questions: [
      {
        q: "A message claims you won a prize but asks for your password. What should you do?",
        options: ["Share the password", "Click every link", "Do not share it; check if the message is genuine"],
        answer: 2
      },
      {
        q: "What should you do before posting a photo of a friend?",
        options: ["Ask their permission", "Post it secretly", "Share it publicly without asking"],
        answer: 0
      },
      {
        q: "Someone online says they know your home address. What should you do?",
        options: ["Give them more details", "Tell a trusted adult and report the account", "Meet them"],
        answer: 1
      },
      {
        q: "What is two-factor authentication for?",
        options: ["Making your profile colourful", "Sharing your account", "Adding another layer of account security"],
        answer: 2
      }
    ]
  }
];

const saved = JSON.parse(localStorage.getItem("glowProgress") || "{}");
let passed = Array.isArray(saved.passed) ? saved.passed : [];
let points = Number(saved.points) || 0;
let currentLevel = 0;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const levelList = document.getElementById("levelList");
const quiz = document.getElementById("quiz");
const quizContent = document.getElementById("quizContent");

function saveProgress() {
  localStorage.setItem("glowProgress", JSON.stringify({
    passed: passed,
    points: points
  }));
}

function updateStats() {
  document.getElementById("points").textContent = points;
  document.getElementById("completed").textContent = passed.length + "/4";
  document.getElementById("badges").textContent = passed.length;

  const shelf = document.getElementById("badgeShelf");
  shelf.innerHTML = "";

  if (passed.length === 0) {
    shelf.textContent = "Complete a level to earn your first badge!";
  } else {
    passed.forEach(index => {
      const badge = document.createElement("div");
      badge.className = "badge-item";
      badge.textContent = levels[index].badge;
      shelf.appendChild(badge);
    });
  }
}

function renderLevels() {
  levelList.innerHTML = "";

  levels.forEach((level, index) => {
    const isPassed = passed.includes(index);
    const unlocked = index === 0 || passed.includes(index - 1);

    const card = document.createElement("div");
    card.className = "level-card";

    const heading = document.createElement("h3");
    heading.textContent = (isPassed ? "✅ " : unlocked ? "🌷 " : "🔒 ") +
      "Level " + (index + 1) + ": " + level.title;

    const description = document.createElement("p");
    description.textContent = isPassed
      ? "Passed! Badge earned."
      : unlocked
        ? "Answer 3 out of 4 questions correctly to pass."
        : "Pass the previous level to unlock this one.";

    const button = document.createElement("button");
    button.textContent = isPassed ? "Play again" : unlocked ? "Start quiz" : "Locked";
    button.disabled = !unlocked;
    button.addEventListener("click", () => startQuiz(index));

    card.append(heading, description, button);
    levelList.appendChild(card);
  });
}

function startQuiz(index) {
  currentLevel = index;
  currentQuestion = 0;
  score = 0;
  quiz.showModal();
  showQuestion();
}

function showQuestion() {
  const question = levels[currentLevel].questions[currentQuestion];
  selectedAnswer = null;
  quizContent.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "Question " + (currentQuestion + 1) + " of 4";
  quizContent.appendChild(heading);

  const prompt = document.createElement("p");
  prompt.textContent = question.q;
  quizContent.appendChild(prompt);

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => {
      selectedAnswer = index;
      quizContent.querySelectorAll(".option").forEach(item => {
        item.classList.remove("selected");
      });
      button.classList.add("selected");
    });
    quizContent.appendChild(button);
  });

  const next = document.createElement("button");
  next.textContent = currentQuestion === 3 ? "Finish quiz" : "Next question";
  next.style.marginTop = "12px";
  next.addEventListener("click", () => {
    if (selectedAnswer === null) {
      alert("Please select an answer first.");
      return;
    }

    if (selectedAnswer === question.answer) {
      score++;
    }

    currentQuestion++;

    if (currentQuestion < 4) {
      showQuestion();
    } else {
      finishQuiz();
    }
  });

  quizContent.appendChild(next);
}

function finishQuiz() {
  quizContent.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = score >= 3 ? "🎉 Level passed!" : "🌱 Keep practising!";
  quizContent.appendChild(heading);

  const result = document.createElement("p");
  result.textContent = "You scored " + score + " out of 4.";
  quizContent.appendChild(result);

  if (score >= 3) {
    if (!passed.includes(currentLevel)) {
      passed.push(currentLevel);
      points += 10;
      saveProgress();
    }

    const badge = document.createElement("p");
    badge.textContent = "Badge: " + levels[currentLevel].badge;
    quizContent.appendChild(badge);

    const message = document.createElement("p");
    message.textContent = "Well done! Keep learning how to stay safe.";
    quizContent.appendChild(message);
  } else {
    const message = document.createElement("p");
    message.textContent = "You need 3 correct answers. Try again to pass.";
    quizContent.appendChild(message);
  }

  const close = document.createElement("button");
  close.textContent = "Back to levels";
  close.addEventListener("click", () => {
    quiz.close();
    updateStats();
    renderLevels();
  });

  quizContent.appendChild(close);
}

document.getElementById("closeQuiz").addEventListener("click", () => {
  quiz.close();
});

updateStats();
renderLevels();
