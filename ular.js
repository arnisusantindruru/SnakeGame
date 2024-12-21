const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

// Game variables
const gridSize = 20; // Ukuran grid untuk ular
const canvasSize = 600; // Ukuran canvas
let snake = [{ x: 160, y: 160 }]; // Posisi awal ular
let direction = 'right'; // Arah gerakan ular
let food = spawnFood(); // Makanan ular
let score = 0;
let gameInterval;
let foodColor = getRandomFoodColor(); // Warna makanan yang berubah setiap dimakan

// Mulai permainan
function startGame() {
    snake = [{ x: 160, y: 160 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    food = spawnFood();
    foodColor = getRandomFoodColor(); // Set warna baru setiap game dimulai
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 110);
}

// Game loop
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert("Game Over! Skor akhir: " + score);
    } else {
        if (checkFoodCollision()) {
            score += 10;
            scoreElement.textContent = score;
            foodColor = getRandomFoodColor(); // Ubah warna makanan setelah dimakan
            food = spawnFood(); // Makanan baru setelah dimakan
        }
        drawGame();
    }
}

// Gerakkan ular (menembus dinding)
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    // Jika ular melewati batas, muncul dari sisi yang berlawanan
    if (head.x < 0) head.x = canvasSize - gridSize; // Kiri ke kanan
    if (head.x >= canvasSize) head.x = 0; // Kanan ke kiri
    if (head.y < 0) head.y = canvasSize - gridSize; // Atas ke bawah
    if (head.y >= canvasSize) head.y = 0; // Bawah ke atas

    snake.unshift(head); // Menambahkan kepala baru

    // Jika ular tidak makan makanan, kita hapus bagian terakhir dari ular
    if (!checkFoodCollision()) {
        snake.pop(); // Hapus bagian terakhir jika tidak makan makanan
    }
}

// Periksa tabrakan dengan tubuh ular
function checkCollision() {
    const head = snake[0];
    // Cek tabrakan dengan tubuh ular
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Periksa jika ular makan makanan
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Gambar permainan
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Bersihkan canvas
    // Gambar ular
    snake.forEach(segment => {
        ctx.fillStyle = '#ff69b4'; // Warna ular
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
    
    // Gambar makanan dengan warna yang berubah setelah dimakan
    ctx.fillStyle = foodColor; // Menggunakan warna baru setelah dimakan
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Spawn makanan di posisi acak
function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Fungsi untuk mendapatkan warna acak untuk makanan
function getRandomFoodColor() {
    const colors = ['red', 'green', 'blue', 'purple', 'orange', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Mengatur input keyboard untuk menggerakkan ular
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

// Tombol untuk memulai permainan lagi
restartButton.addEventListener('click', startGame);

// Mulai permainan pertama kali
startGame();
