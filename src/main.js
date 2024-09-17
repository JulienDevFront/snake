import "./assets/styles/main.scss";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// Assurer des dimensions fixes
canvas.width = 400;
canvas.height = 400;

// Défini une taille par défaut du serpent et de la nourriture
const snakeSize = 20;

// Définir la position initiale du serpent avec trois segments
let snake = [
    { x: 100, y: 100 },
    { x: 80, y: 100 },
    { x: 60, y: 100 },
];

let currentDirection = "e"; // Direction initiale (est/droite)

// Variables pour contrôler la vitesse
let speed = 150; // Temps en millisecondes entre les mouvements
let lastMoveTime = 0; // Dernière fois que le serpent a bougé

// Position initiale de la nourriture (aléatoire)
let food = {
    x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
    y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
};

// Compteur de score
let score = 0;

// Dessine le serpent sur le canvas
const drawSnake = () => {
    ctx.fillStyle = "#fef3ec";
    snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize));
};

// Dessine la nourriture sur le canvas
const drawFood = () => {
    ctx.fillStyle = "#ff4757"; // Couleur de la nourriture (rouge)
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
};

// Dessine le score sur le canvas
const drawScore = () => {
    ctx.fillStyle = "#ffffff"; // Couleur du texte du score
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
};

// Vérifie les collisions avec les murs du canvas
const checkWallCollision = (head) => {
    return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
};

// Vérifie les collisions avec le corps du serpent
const checkSelfCollision = (head) => {
    return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
};

// Met à jour la position du serpent
const moveSnake = () => {
    // Créer une nouvelle tête basée sur la direction actuelle
    const head = { ...snake[0] };

    switch (currentDirection) {
        case "e":
            head.x += snakeSize;
            break;
        case "o":
            head.x -= snakeSize;
            break;
        case "n":
            head.y -= snakeSize;
            break;
        case "s":
            head.y += snakeSize;
            break;
    }

    // Gérer la réapparition du serpent de l'autre côté
    if (head.x < 0) head.x = canvas.width - snakeSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - snakeSize;
    if (head.y >= canvas.height) head.y = 0;

    // Ajouter la nouvelle tête au début du tableau
    snake.unshift(head);

    // Vérifier si le serpent mange la nourriture
    if (head.x === food.x && head.y === food.y) {
        // Générer une nouvelle position pour la nourriture
        food = {
            x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
            y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
        };
        score++; // Augmenter le score
    } else {
        // Supprimer le dernier segment pour simuler le mouvement
        snake.pop();
    }

    // Vérifier les collisions
    if (checkWallCollision(head) || checkSelfCollision(head)) {
        alert("Game Over!");
        // Réinitialiser le jeu
        snake = [
            { x: 100, y: 100 },
            { x: 80, y: 100 },
            { x: 60, y: 100 },
        ];
        currentDirection = "e";
        speed = 150;
        lastMoveTime = 0;
        score = 0;
        food = {
            x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
            y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
        };
    }
};

// Met à jour le jeu à chaque frame
const updateGame = (currentTime) => {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redessiner le fond
    ctx.fillStyle = "#1E1E1E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Contrôler la vitesse de mouvement du serpent
    if (currentTime - lastMoveTime > speed) {
        moveSnake(); // Déplacer le serpent seulement si le délai est passé
        lastMoveTime = currentTime; // Mettre à jour le dernier temps de mouvement
    }

    // Dessiner la nourriture, le serpent et le score
    drawFood();
    drawSnake();
    drawScore();

    // Appeler la fonction de mise à jour pour la prochaine frame
    requestAnimationFrame(updateGame);
};

// Démarrer le jeu
requestAnimationFrame(updateGame);

// Change la direction du serpent en fonction de la touche pressée
const changeDirection = (event) => {
    const key = event.key;

    switch (key) {
        case "ArrowUp":
            if (currentDirection !== "s") currentDirection = "n"; // Ne peut pas aller directement en arrière
            break;
        case "ArrowDown":
            if (currentDirection !== "n") currentDirection = "s";
            break;
        case "ArrowLeft":
            if (currentDirection !== "e") currentDirection = "o";
            break;
        case "ArrowRight":
            if (currentDirection !== "o") currentDirection = "e";
            break;
    }
};

// Ajouter l'écouteur d'événements pour le clavier
document.addEventListener("keydown", changeDirection);
