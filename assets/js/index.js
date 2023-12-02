const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const score = document.querySelector('.score')
const bomb = document.querySelector('.bomb')
const id_pergunta_hidden = document.getElementById("id_pergunta");
const button_enviar = document.getElementById("enviar_resposta");
let loopSetInerval = null;

let isJump = false;
let marioPostionGlobal = 0;

// Variaveis jogos perguntas e respostas
const pergunta_especifica = document.querySelector(".pergunta_especifica")
const pergunta_choose = document.querySelector(".pergunta_choose")
const div_conteudo = document.querySelector(".conteudo")
const div_conteudo_pausado = document.querySelector(".conteudo_pausado")
const div_centro = document.querySelector(".centro")
const message_status = document.querySelector('.message_status');

let count = 0;
let gameOver = false;
let gameRound = false;

const jump = () => {
    mario.classList.add('jump');
    isJump = true;
    console.log(isJump);
    setTimeout(() => {
        mario.classList.remove('jump');
        // if (!gameOver) {
        //     count = count + 1;
        //     score.querySelector('div span').textContent = count;
        // }
        isJump = false;
        console.log(isJump)

        if (gameRound) {
            gameRound = false;
            marioPostionGlobal = +window.getComputedStyle(mario).bottom.replace('px', '');
            if (marioPostionGlobal === 0) {
                // stopAninamtion(-50, marioPostionGlobal);
                pipe.style.animationPlayState = 'paused';
                gerarPergunta();
            }
        }
    }, 500);
}
const loop = () => {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        stopAninamtion(pipePosition, marioPosition);

        gameOver = true
        main(true);
        console.log(pipePosition)
    }


    if (pipePosition > 0 && pipePosition <= 120 && marioPosition > 80) {
        gameRound = true;
    }

};
// const loop = setInterval(() => {

//     const pipePosition = pipe.offsetLeft;
//     const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

//     if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
//         stopAninamtion(pipePosition, marioPosition);

//         gameOver = true
//         clearInterval(loop);
//         main();
//         console.log(pipePosition)
//     }


//     if (pipePosition > 0 && pipePosition <= 120 && marioPosition > 80){
//         gameRound = true;
//     }

// }, 10);

function stopAninamtion(pipePosition, marioPosition) {
    bomb.style.display = "block";
    // pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    // mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    // mario.src = './assets/imagens/game-over.png';
    // mario.style.width = '75px';
    // mario.style.marginLeft = '50px'
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function gerarPergunta() {
    pergunta_choose.innerHTML = "";
    const pergunta_selecionada = results[getRandomInt(results.length)];
    pergunta_especifica.innerHTML = pergunta_selecionada.pergunta;
    id_pergunta_hidden.value = pergunta_selecionada.id;
    for (let index = 0; index < pergunta_selecionada.sugestoes.length; index++) {
        const element = pergunta_selecionada.sugestoes[index];
        pergunta_choose.appendChild(gerarHtmlPergunta(element.title));
    }
    div_conteudo_pausado.style.zIndex = 0
    div_conteudo.style.opacity = 1;
    div_conteudo.style.zIndex = 1
}

function gerarHtmlPergunta(param_title) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");

    // input
    input.setAttribute("type", "radio");
    input.setAttribute("id", param_title);
    input.setAttribute("name", "perguntas");

    // label
    label.setAttribute("for", param_title);
    label.innerHTML = param_title;

    div.appendChild(input);
    div.appendChild(label);
    return div;
}

function enviarResposta() {
    button_enviar.blur();
    const rd_pq_selc = document.querySelector('input[name=perguntas]:checked');
    if (rd_pq_selc != null && rd_pq_selc != "") {
        const pq_selec = results.find(c => c.id == parseInt(id_pergunta_hidden.value));
        const pq_selec_user = pq_selec.sugestoes.find(c => c.title == rd_pq_selc.id);
        if (pq_selec_user.resposta) {
            count = count + 10;
            score.querySelector('div span').textContent = count;
            pipe.style.animationPlayState = 'running';
            div_conteudo.style.opacity = 0;
        } else {
            main(true);
        }
    } else {
        alert("Preencha corretamente");
    }
}

function iniciarJogo() {

    pipe.style.animationPlayState = 'running';
    pipe.style.left = '';
    mario.style.bottom = '';
    bomb.style.display = "none";
    pipe.classList.add('pipe_animation');
    // div_centro.removeChild(document.querySelector(".conteudo_pausado"))
    div_conteudo_pausado.style.opacity = 0;
    loopSetInerval = window.setInterval(loop, 0);
    mario.src = `./assets/imagens/${swiper.activeIndex}.gif`
}

const createHTMLMessageStatus = (mensagem) => {
    let divMensagemStatus = document.createElement("div");

    divMensagemStatus.setAttribute("class", "message_status")
    divMensagemStatus.innerHTML = mensagem;
    return divMensagemStatus;
}

// const createHTMLMessagePontuacao = (pontuacao) => {
//     let divMensagemStatusPontuacao = document.createElement("div");
//     let span = document.createElement("span");

//     divMensagemStatusPontuacao.setAttribute("class", "message-status-pontuacao")
//     span.innerHTML = "A sua pontuação foi" + pontuacao;
//     divMensagemStatusPontuacao.appendChild(span);
//     return divMensagemStatusPontuacao;
// }

const main = (isGameOver) => {

    pipe.style.animationPlayState = 'paused';
    pipe.classList.remove('pipe_animation');
    clearInterval(loopSetInerval);
    score.querySelector('div span').textContent = 0;
    div_conteudo.style.opacity = 0;
    div_conteudo.style.zIndex = 0;
    div_conteudo_pausado.style.opacity = 2;
    div_conteudo_pausado.style.zIndex = 1
    
    
    // let button = document.createElement("button");
    // button.setAttribute("onclick", "iniciarJogo()");
    // button.setAttribute("id", "iniciar_jogo");
    // button.innerText = "INICIAR JOGO";


    // div_conteudo_pausado.setAttribute("class", "conteudo_pausado")
    // div_conteudo_pausado.appendChild(button);
    if (isGameOver) {
        message_status.innerHTML = "Você perdeu... não fica triste!! Vamos estudar novamente?"
    }


    div_centro.appendChild(div_conteudo_pausado);
}

main();

// Register events
document.addEventListener('keydown', jump);
window.addEventListener('touchstart', jump);