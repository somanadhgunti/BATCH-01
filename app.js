const typingText = document.querySelector('#typing-area');
const inputField = document.querySelector('#input-field');
const timeTag = document.querySelector('#time');
const errorTag = document.querySelector('#errors');
const wpmTag = document.querySelector('#wpm');
const cpmTag = document.querySelector('#cpm');
const tryAgainButton = document.querySelector('#try-again-button');

let characterIndex = 0;
let errors = 0;
let timer;
let timeLeft = 60;
let isTyping = false;
let startTime;
let typingParagraph = "";

// Define an array of paragraphs for the typing test
const paragraphs = [
    "The early morning mist rolled over the lush green fields, creating a serene atmosphere as the sun began to peek over the horizon, casting long shadows across the landscape.",
    "A vibrant tapestry of colors filled the bustling marketplace, where vendors enthusiastically hawked their wares, from fresh produce to intricately woven textiles, as the rhythmic chatter of the crowd echoed through the air.",
    "With each gentle step, the hiker traversed the rugged mountain trail, marveling at the breathtaking panoramic views of the snow-capped peaks that surrounded them, feeling a sense of accomplishment with every summit reached.",
    "The quaint little bookstore was a haven for book lovers, with towering shelves overflowing with stories from diverse genres, inviting readers to explore new worlds and discover hidden gems within the pages.",
    "As the rain pattered against the windowpane, the cozy living room was filled with the warm glow of the fireplace, providing a perfect setting for curling up with a good book and a steaming cup of tea.",
    "Nature's first green is gold,Her hardest hue to hold.Her early leaf's a flower But only so an hour.",
    "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate."
];

// Function to get and display a random paragraph
function randomParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  typingParagraph = paragraphs[randomIndex];

  typingText.innerHTML = typingParagraph.split('').map(char => `<span>${char}</span>`).join('');
  
  characterIndex = 0;
  errors = 0;
  inputField.value = '';
  errorTag.textContent = errors;
  wpmTag.textContent = 0;
  cpmTag.textContent = 0;
  timeLeft = 60;
  timeTag.textContent = timeLeft;
  
  inputField.focus();
  startTime = Date.now();
  clearInterval(timer); // Clear previous timer if any
  timer = setInterval(updateTimer, 1000); // Start the timer
}

// Timer to countdown every second
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.textContent = timeLeft;
  } else {
    clearInterval(timer); // Stop the timer
    finishTest(); // End the test when time is up
  }
}

// Function to handle the typing input
inputField.addEventListener('input', (event) => {
    const typedText = inputField.value;
    const characters = typingText.querySelectorAll('span');
  
    if (event.inputType === 'deleteContentBackward') {
      // Handle backspace key
      if (characterIndex > 0) {
        characterIndex--; // Move back one character
        characters[characterIndex].classList.remove('correct', 'incorrect'); // Remove highlights
      }
    } else {
      // Regular typing
      if (characterIndex < characters.length) {
        const currentCharacter = characters[characterIndex];
  
        if (typedText[characterIndex] === currentCharacter.innerText) {
          currentCharacter.classList.add('correct');
          currentCharacter.classList.remove('incorrect');
        } else {
          currentCharacter.classList.add('incorrect');
          currentCharacter.classList.remove('correct');
          errors++;
        }
  
        characterIndex++;
        errorTag.textContent = errors;
  
        // Update WPM and CPM
        const totalTime = (Date.now() - startTime) / 1000; // Time in seconds
        const wpm = Math.floor(((characterIndex - errors) / 5) / (totalTime / 60));
        const cpm = characterIndex - errors;
  
        wpmTag.textContent = wpm;
        cpmTag.textContent = cpm;
      }
    }
  
    // Check if the user has completed typing the paragraph
    if (characterIndex === characters.length) {
      finishTest();
    }
  });
  

// Function to finish the test and show the results
function finishTest() {
  alert(`Test Completed! 
    WPM: ${wpmTag.textContent}
    CPM: ${cpmTag.textContent}
    Errors: ${errorTag.textContent}`);

  // Optionally, check leaderboard or update results
  checkLeaderboard();
}

// Function to check leaderboard
function checkLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const currentWpm = parseInt(wpmTag.textContent);
  
  // Check if the user scored in the top 10
  leaderboard.push({ name: 'User', wpm: currentWpm, errors: errors });
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  leaderboard = leaderboard.slice(0, 10); // Keep top 10 scores
  
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  console.log('Updated Leaderboard:', leaderboard);
}

// Event listener for the "Try Again" button
tryAgainButton.addEventListener('click', randomParagraph);

// Initialize the first paragraph when the page loads
randomParagraph();
