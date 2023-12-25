const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const bomb = document.querySelector('.bomb')
const moldura_div_score = document.querySelector('.moldura_div_score')
const moldura_div_username = document.querySelector('.moldura_div_username')
const iniciar_jogo = document.getElementById('iniciar_jogo');
const id_pergunta_hidden = document.getElementById("id_pergunta");
const button_enviar = document.getElementById("enviar_resposta");
let loopSetInerval = null;
let perguntasRespondidas = [];

let isStopped = false;
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
    if (!isStopped) {
        console.log('jump');
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
            marioPostionGlobal = +window.getComputedStyle(mario).bottom.replace('px', '');
            if (marioPostionGlobal === 0) {
                if (gameRound) {
                    removeEventsPlay();
                    isStopped = true;
                    pipe.style.animationPlayState = 'paused';
                    gerarPergunta();
                    gameRound = false;
                }
            }
        }, 500);
    }
}
const loop = () => {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    // console.log(pipePosition);
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        stopAninamtion(pipePosition, marioPosition);
        removeEventsPlay();
        gameOver = true
        clearInterval(loopSetInerval);
        main(true);
    }

    if (pipePosition > 0 && pipePosition <= 120 && marioPosition > 80) {
        gameRound = true;
    }

};

function stopAninamtion(pipePosition, marioPosition) {
    bomb.style.display = "block";
    pipe.style.left = `${pipePosition}px`;
    mario.style.bottom = `${marioPosition}px`;
}

function getRandomInt(min, max, exclude) {
    let random;
    if (perguntasRespondidas && results && perguntasRespondidas.length === results.length) {
        return -1;
    } else {
        while (!random) {
            const x = Math.floor(Math.random() * (max - min + 1)) + min;
            if (exclude.indexOf(x) === -1) random = x;
        }
        return random;
    }
}

function gerarPergunta() {
    pergunta_choose.innerHTML = "";
    const sortearPergunta = getRandomInt(1, results.length, perguntasRespondidas)
    if (sortearPergunta && sortearPergunta === -1) {
        alert("Parabéns você finalizou todas as perguntas");
    } else {
        const pergunta_selecionada = results.find(x => x.id === sortearPergunta);
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
            perguntasRespondidas.push(parseInt(id_pergunta_hidden.value));
            moldura_div_score.innerHTML = count;
            pipe.style.animationPlayState = 'running';
            div_conteudo.style.opacity = 0;
            isStopped = false;
        } else {
            main(true);
        }
    } else {
        alert("Preencha corretamente");
    }
}

function iniciarJogo() {
    console.log('iniciar')
    pipe.classList.add('pipe_animation');
    pipe.style.animationPlayState = 'running';
    pipe.style.left = '';
    mario.style.bottom = '';
    bomb.style.display = "none";
    
    count = 0;
    moldura_div_score.innerHTML = 0;
    div_conteudo_pausado.style.opacity = 0;
    clearInterval(loopSetInerval);
    loopSetInerval = window.setInterval(loop, 10);
    iniciar_jogo.blur();
    window.addEventListener('keydown', jump);
}

const createHTMLMessageStatus = (mensagem) => {
    let divMensagemStatus = document.createElement("div");

    divMensagemStatus.setAttribute("class", "message_status")
    divMensagemStatus.innerHTML = mensagem;
    return divMensagemStatus;
}

const removeEventsPlay = () => {
    window.removeEventListener('keydown', jump);
    //window.addEventListener('touchstart', jump);
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
    div_conteudo.style.opacity = 0;
    div_conteudo.style.zIndex = 0;
    div_conteudo_pausado.style.opacity = 2;
    div_conteudo_pausado.style.zIndex = 1
    isStopped = false;
    // let button = document.createElement("button");
    // button.setAttribute("onclick", "iniciarJogo()");
    // button.setAttribute("id", "iniciar_jogo");
    // button.innerText = "INICIAR JOGO";


    // div_conteudo_pausado.setAttribute("class", "conteudo_pausado")
    // div_conteudo_pausado.appendChild(button);
    if (isGameOver) {
        message_status.innerHTML = "Você perdeu... não fica triste!! Vamos estudar novamente?"
        bomb.src = `./assets/imagens/bomb/${getRandomInt(1, 10, [])}.gif`
    }
    div_centro.appendChild(div_conteudo_pausado);
}

main();

// Register events
window.addEventListener('keydown', jump);
window.addEventListener('touchstart', jump);