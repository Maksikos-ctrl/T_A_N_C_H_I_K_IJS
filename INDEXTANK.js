/*
    Случайное целое число
 */

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function gameOver() {
    document.querySelector('.game-over').classList.add('on');
}

/*
    Перезапустить игру
 */

function next() {

    player.hp -= 1;

    clearInterval(ints.enemy);
    clearInterval(ints.run);
    clearInterval(ints.bullet);
    clearInterval(ints.generateEnemy);

    let enemies = document.querySelectorAll('.enemy');

    enemies.forEach((enemy) => {
        enemy.parentNode.removeChild(enemy);
    });

    player.el.parentNode.removeChild(player.el);

    if (player.hp === 0) {
        return gameOver();
    }

    game();
}


/*
    
 */

function init() {

    if (player.hp === 0) {
        player.hp = 2;
        points = 0;
    }

    document.querySelector('.game-over').classList.remove('on');

    player.x = gameZone.getBoundingClientRect().width / 2 - player.w;
    player.y = gameZone.getBoundingClientRect().height - player.h;

    gameZone.innerHTML += `<div class="player" style="left: ${player.x}px; top: ${player.y}px;"></div>`;
    player.el = document.querySelector('.player');

    switch (player.hp) {
        case 2:
            document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-1.png" class="life__image">`;
            break;
        case 1:
            document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-2.png" class="life__image">`;
            break;
        case 0:
            document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-3.png" class="life__image">`;
            break;
    }


}

/*
    Промежутки
 */

function intervals() {
    ints.run = setInterval(() => {
        if (player.run) {
            switch (player.side) {
                case 1: // верхний
                    if (player.y > 0) {
                        player.y -= player.step;
                        player.el.style.top = `${player.y}px`;
                    }
                    break;
                case 3: // кнопка
                    if (player.y < gameZone.getBoundingClientRect().bottom - player.h - 2) {
                        player.y += player.step;
                        player.el.style.top = `${player.y}px`;
                    }
                    break;
                case 2: // Справа
                    if (player.x < gameZone.getBoundingClientRect().right - player.w - 2) {
                        player.x += player.step;
                        player.el.style.left = `${player.x}px`;
                    }
                    break;
                case 4: // Слева=
                    if (player.x > 0) {
                        player.x -= player.step;
                        player.el.style.left = `${player.x}px`;
                    }
                    break;
            }
        }
    }, fps);
    ints.bullet = setInterval(() => {
        let bullets = document.querySelectorAll('.bullet');
        bullets.forEach((bullet) => {
            let direction = bullet.getAttribute('direction');

            switch (direction) {
                case 'top':
                    if (bullet.getBoundingClientRect().top < 0) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top - bulletSpeed + 'px';
                    }
                    break;
                case 'right':
                    if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left + bulletSpeed + 'px';
                    }
                    break;
                case 'bottom':
                    if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top + bulletSpeed + 'px';
                    }
                    break;
                case 'left':
                    if (bullet.getBoundingClientRect().left < 0) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left - bulletSpeed + 'px';
                    }
                    break;
            }

        })
    }, fps);
    ints.enemy = setInterval(() => {
        let enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {

            const playerPosTop = player.el.getBoundingClientRect().top,
                playerPosRight = player.el.getBoundingClientRect().right,
                playerPosBottom = player.el.getBoundingClientRect().bottom,
                playerPosLeft = player.el.getBoundingClientRect().left,
                enemyPosTop = enemy.getBoundingClientRect().top,
                enemyPosRight = enemy.getBoundingClientRect().right,
                enemyPosBottom = enemy.getBoundingClientRect().bottom,
                enemyPosLeft = enemy.getBoundingClientRect().left;


            if (
                playerPosTop < enemyPosBottom &&
                playerPosBottom > enemyPosTop &&
                playerPosRight > enemyPosLeft &&
                playerPosLeft < enemyPosRight
            ) {
                next();
                //alert('Столкновение')
            }


            let bullets = document.querySelectorAll('.bullet');

            bullets.forEach((bullet) => {

                let direction = bullet.getAttribute('direction');

                if (['top', 'left', 'right'].includes(direction)) {
                    if (
                        bullet.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        enemy.parentNode.removeChild(enemy);
                        bullet.parentNode.removeChild(bullet);
                        points += 1;
                        document.querySelector('.inner-points').innerText = points;
                    }
                } else {
                    if (
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        enemy.parentNode.removeChild(enemy);
                        bullet.parentNode.removeChild(bullet);
                        points += 1;
                        document.querySelector('.inner-points').innerText = points;
                    }
                }

            });

            let direction = enemy.getAttribute('direction');

            switch (direction) {
                case 'right':
                    if (enemy.getBoundingClientRect().left <= 0) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left - 3 + 'px';
                    }
                    break;
                case 'left':
                    if (enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
                    }
                    break;
                case 'top':
                    if (enemy.getBoundingClientRect().top <= 0) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.top = enemy.getBoundingClientRect().top - 3 + 'px';
                    }
                    break;
                case 'bottom':
                    if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.top = enemy.getBoundingClientRect().top + 3 + 'px';
                    }
                    break;
            }

            // if (enemy.getBoundingClientRect().right >= gameZone.getBoundingClientRect().width) {
            //     enemy.parentNode.removeChild(enemy);
            // } else {
            //     enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
            // }

        })
    }, fps);
    ints.generateEnemy = setInterval(() => {

        let direction = randomInteger(1, 4);

        switch (direction) {
            case 1: //верхний
                gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-90deg); top: ${gameZone.getBoun
                break;
            case 2: //Лево
                gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-180deg); top: ${randomInteger(0
                break;
            case 3: //Кнопка
                gameZone.innerHTML += `<div class="enemy" style="transform: rotate(90deg); top: 0; left: ${randomIn
                break;
            case 4: //Право
                gameZone.innerHTML += `<div class="enemy" style="top: ${randomInteger(0, gameZone.getBoundingClient
                break;
        }


        player.el = document.querySelector('.player');
    }, 3000);
}

/*
    Добавить пулю
 */

function addBullet() {

    switch (player.side) {
        case 1:
            gameZone.innerHTML += `<div class="bullet" direction="top" style="left: ${(player.x + (player.w / 2)) -
            break;
        case 2:
            gameZone.innerHTML += `<div class="bullet" direction="right" style="left: ${player.x + player.w}px; top
            break;
        case 3:
            gameZone.innerHTML += `<div class="bullet" direction="bottom" style="left: ${player.x + player.w / 2 - 
            break;
        case 4:
            gameZone.innerHTML += `<div class="bullet" direction="left" style="left: ${player.x}px; top: ${player.y
            break;
    }

    player.el = document.querySelector('.player');
}

/*
    Контролерри
 */

function controllers() {
    document.addEventListener('keydown', (e) => {

        //console.log(e.keyCode)

        switch (e.keyCode) {
            case 38: // верхний
                player.el.style.backgroundImage = `url(${player.sprites.top})`;
                player.run = true;
                player.side = 1;
                break;
            case 40: // кнопка
                player.el.style.backgroundImage = `url(${player.sprites.bottom})`;
                player.run = true;
                player.side = 3;
                break;
            case 39: // Право
                player.el.style.backgroundImage = `url(${player.sprites.right})`;
                player.run = true;
                player.side = 2;
                break;
            case 37: //лево
                player.el.style.backgroundImage = `url(${player.sprites.left})`;
                player.run = true;
                player.side = 4;
                break;
            case 65: //вистрел
                addBullet();
                break;
        }

    });

    document.addEventListener('keyup', (e) => {
        if ([38, 40, 39, 37].includes(e.keyCode))
            player.run = false;
    })


}


/*
    Начать игру
 */

function game() {
    init();
    controllers();
    intervals();
}

let gameZone = document.querySelector('.game-zone'),
    points = 0,
    fps = 1000 / 60,
    player = {
        sprites: {
            top: 'player-top.png',
            right: 'player-right.png',
            bottom: 'player-bottom.png',
            left: 'player-left.png',
        },
        el: false,
        x: 500,
        y: 400,
        step: 10,
        run: false,
        side: 1, //1 (верхний), 2 (право), 3 (кнопка), 4 (лево),
        w: 78,
        h: 77,
        hp: 2
    },
    bulletSpeed = 10,
    ints = {
        run: false,
        bullet: false,
        enemy: false,
        generateEnemy: false,
        test: false
    };

game();
