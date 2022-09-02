
const conteudo = document.querySelector('.conteudo');
let container = document.querySelector('.container');
const statusCode404 = 404;
let tituloQuizzCriado = "";
let URLImagemQuizzCriado = "";
let qtdPerguntasQuizzCriado = 0;
let qtdNiveisQuizzCriado = 0;
let respondidos = [];
let qtdRespostas = 0;
let certa = 0;
let minValores = [];
let titulosPerguntasQuizzCriado = [];
let corPerguntasQuizzCriado = [];
let respostaCorretaQuizzCriado = [];
let URLRespostaCorretaQuizzCriado = [];
let respostaIncorreta1QuizzCriado = [];
let URLRespostaIncorreta1QuizzCriado = [];
let respostaIncorreta2QuizzCriado = [];
let URLRespostaIncorreta2QuizzCriado = [];
let respostaIncorreta3QuizzCriado = [];
let URLRespostaIncorreta3QuizzCriado = [];

function abrirQuiz() {
    let promessaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/4000');
    promessaQuiz.then(sucessoQuiz);
    promessaQuiz.catch(erroQuiz);
}
function sucessoQuiz(resposta) {
    respondidos = [];
    qtdRespostas = 0;
    certa = 0;
    minValores = [];
    qtdRespostas = resposta.data.levels.length
    conteudo.innerHTML =
        `<div class="banner">
            <img class="bannerImg" src="${resposta.data.image}"></img>
            <h1>${resposta.data.title}</h1>
        </div>
        <div class="container"></div>`
        container = document.querySelector('.container');
        container.style.margin = "0";
    for (let i = 0; i < resposta.data.questions.length; i++) {
        resposta.data.questions[i].answers.sort(comparador)
        container.innerHTML += `
        <div class="questaoDiv p${i}">
            <div class="titulo">${resposta.data.questions[i].title}</div>
            <div class=respostasDiv></div>
        </div>`
        let divTitulo = document.querySelector(`.p${i} .titulo`)
        divTitulo.style.backgroundColor = `${resposta.data.questions[i].color}`;
        let respostasDiv = document.querySelector(`.p${i} .respostasDiv`)
        for (let j = 0; j < resposta.data.questions[i].answers.length; j++) {
            if (resposta.data.questions[i].answers[j].isCorrectAnswer){
            respostasDiv.innerHTML +=
                `<div class="resposta right" onclick="clicaResposta(this); setTempo(this); respostaCerta(this); testaFim(this)">
                    <img class="imgResposta" src="${resposta.data.questions[i].answers[j].image}"></img>
                    <span class="textoResposta">${resposta.data.questions[i].answers[j].text}<span>
                </div>`
            } else {
                respostasDiv.innerHTML +=
                `<div class="resposta" onclick="clicaResposta(this); setTempo(this); testaFim(this)">
                    <img class="imgResposta" src="${resposta.data.questions[i].answers[j].image}"></img>
                    <span class="textoResposta">${resposta.data.questions[i].answers[j].text}<span>
                </div>`
            }
        }
    }
    for (let i=0; i<resposta.data.levels.length; i++){
        minValores.push(resposta.data.levels[i].minValue)
        container.innerHTML += `
        <div class="resultadoQuiz r${i} oculta">
            <div class="tituloResultado">${resposta.data.levels[i].title}</div>
            <div class="imgEDescricao"">
                <img class="imgResultado" src="${resposta.data.levels[i].image}"></img>
                <span class="descricaoResultado">${resposta.data.levels[i].text}</span>
            </div>
        </div>`
    }
    container.innerHTML+=`
    <button class="botaoQuiz botaoVermelho" onclick="abrirQuiz(); scrollarTop()">Reiniciar Quizz</button>
    <button class="botaoQuiz botaoBranco" onclick="reseta()">Voltar pra home</button>
    `
}
function erroQuiz(resposta) {
    console.log(resposta)
}

function clicaResposta(respostaEscolhida) {
    let respostasDiv = respostaEscolhida.parentNode
    for (let i = 0; i < respostasDiv.children.length; i++) {
        if (respostasDiv.children[i].classList.contains('right')) {
            respostasDiv.children[i].classList.add('verde')
        } else {
            respostasDiv.children[i].classList.add('vermelho')
        }
        if (respostaEscolhida.classList.contains('esbranquica')){
            break
        } else if (respostasDiv.children[i] !== respostaEscolhida) {
            respostasDiv.children[i].classList.add('esbranquica')
        }
    }

}
function setTempo(elemento){
    if (!elemento.parentNode.classList.contains('respondido')){
        respondidos.push(elemento)
        setTimeout(setScroll,2000,elemento)
    }
    elemento.parentNode.classList.add('respondido')
}
function setScroll(elemento){
    let proximaquestao = elemento.parentNode.parentNode.nextElementSibling
    proximaquestao.scrollIntoView()
}
function respostaCerta(elemento){
    if (!elemento.classList.contains('esbranquica')){
        certa++
    }
}

function testaFim(argumento){
    if (!argumento.parentNode.classList.contains('endReady')){    
        if (respondidos.length===qtdRespostas){
            let pontuacao = Math.round(certa/qtdRespostas*(100))
            for (let i=0; i<minValores.length; i++){
                if (pontuacao>=minValores[i] && pontuacao<=minValores[i+1]){
                    const resultado = document.querySelector(`.r${i}`)
                    const tituloResultado = resultado.children[0]
                    resultado.classList.remove('oculta')
                    tituloResultado.innerHTML= `${pontuacao}% de acerto: ${tituloResultado.innerHTML}`
                    setTempoResultado(resultado)
                } 
            }
            if (pontuacao>=minValores[minValores.length-1]) {
                const todosresultados = document.querySelectorAll(`.resultadoQuiz`)
                const resultado=todosresultados[(todosresultados.length)-1]
                const tituloResultado = resultado.children[0]
                resultado.classList.remove('oculta')
                tituloResultado.innerHTML= `${pontuacao}% de acerto: ${tituloResultado.innerHTML}`
                setTempoResultado(resultado)
            }
        }
    }
    argumento.parentNode.classList.add('endReady')
}

function setTempoResultado(argumento){
    setTimeout(setScrollResultado,2000,argumento)
}
function setScrollResultado(argumento){
    argumento.scrollIntoView()
}
function reseta(){
    window.location.reload(true)
}
function scrollarTop(){
    const top = document.querySelector('.banner')
    top.scrollIntoView(true)
}

function comparador() {
    return Math.random() - 0.5;
}

function BuscarQuizzes() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promessa.then(ListarQuizzes);
    promessa.catch(tratarErroBuscarQuizzes);
}

BuscarQuizzes();

function ListarQuizzes(resposta) {
    const listaQuizzes = resposta.data;
    const quizzes = document.querySelector(".todos-quizzes .quizzes");

    for (let i = 0; i < listaQuizzes.length; i++) {
        quizzes.innerHTML += `
            <div class="quizz" onclick="abrirQuiz()">
                <img src="${listaQuizzes[i].image}"
                    alt="${listaQuizzes[i].id}">
                <p>${listaQuizzes[i].title}</p>
            </div>
        `
    }
}

function tratarErroBuscarQuizzes(erro) {
    tratarErro404(erro);
}

function tratarErro404(erro) {
    if (erro.response.status == statusCode404) {
        alert("API inválida");
    }
}

function criarQuizz() {
    conteudo.innerHTML = `
    <div class="container">
        <h2>Comece pelo começo</h2>

        <div class="caixa-criacao">
            <input type="text" placeholder="Título do seu quizz">
            <input type="text" placeholder="URL da imagem do seu quizz">
            <input type="text" placeholder="Quantidade de perguntas do seu quizz">
            <input type="text" placeholder="Quantidade de níveis do seu quizz">
        </div>
        <button class="botao" onclick="checarInformacoesBasicas()">Prosseguir para criar perguntas</button>
    </div>
    `
}

function checarInformacoesBasicas() {
    tituloQuizzCriado = document.querySelector(".caixa-criacao :nth-child(1)").value;
    URLImagemQuizzCriado = document.querySelector(".caixa-criacao :nth-child(2)").value;
    qtdPerguntasQuizzCriado = Number(document.querySelector(".caixa-criacao :nth-child(3)").value);
    qtdNiveisQuizzCriado = Number(document.querySelector(".caixa-criacao :nth-child(4)").value);
    if (tituloQuizzCriado.length >= 20 && tituloQuizzCriado.length <= 65 && (URLImagemQuizzCriado.startsWith('https://') || URLImagemQuizzCriado.startsWith('http://')) && qtdPerguntasQuizzCriado >= 3 && qtdNiveisQuizzCriado >= 2) {
        prosseguirCriacaoPerguntas();
    } else {
        alert("Preencha os dados corretamente");
    }
}

function prosseguirCriacaoPerguntas() {
    conteudo.innerHTML = `
    <div class="container">
        <h2>Crie suas perguntas</h2>
        <div class="perguntas">
            <div class="caixa-criacao">
            <h2>Pergunta 1</h2>
            <ion-icon name="create-outline" onclick="minimizarCaixaPerguntas(this)"></ion-icon>
            <div class="info-pergunta">
                <div class="criacao-pergunta">
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="color" placeholder="Cor de fundo da pergunta">
                </div>

                <div class="criacao-resposta-correta">
                    <h2>Resposta correta</h2>
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                </div>

                <div class="criacao-respostas-incorretas">
                    <h2>Respostas incorretas</h2>
                    <div class="criacao-resposta-incorreta1">
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="text" placeholder="URL da imagem 1">
                     </div>
                    <div class="criacao-resposta-incorreta2">
                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="text" placeholder="URL da imagem 2">
                    </div>
                    <div class="criacao-resposta-incorreta3">
                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
            </div>
        </div>
        </div>
        <button class="botao" onclick="checarPerguntas()">Prosseguir para criar níveis</button>
    </div>`
    const perguntas = document.querySelector(".perguntas");
    for (let i = 0; i < qtdPerguntasQuizzCriado - 1; i++) {
        perguntas.innerHTML += `
        <div class="caixa-criacao">
            <h2>Pergunta ${i + 2}</h2>
            <ion-icon name="create-outline" onclick="minimizarCaixaPerguntas(this)"></ion-icon>
            <div class="info-pergunta escondido">
                <div class="criacao-pergunta">
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="color" placeholder="Cor de fundo da pergunta">
                </div>

                <div class="criacao-resposta-correta">
                    <h2>Resposta correta</h2>
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                </div>

                <div class="criacao-respostas-incorretas">
                    <h2>Respostas incorretas</h2>
                    <div class="criacao-resposta-incorreta1">
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="text" placeholder="URL da imagem 1">
                     </div>
                    <div class="criacao-resposta-incorreta2">
                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="text" placeholder="URL da imagem 2">
                    </div>
                    <div class="criacao-resposta-incorreta3">
                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

function checarPerguntas() {
    titulosPerguntasQuizzCriado = [];
    corPerguntasQuizzCriado = [];
    respostaCorretaQuizzCriado = [];
    URLRespostaCorretaQuizzCriado = [];
    respostaIncorreta1QuizzCriado = [];
    URLRespostaIncorreta1QuizzCriado = [];
    respostaIncorreta2QuizzCriado = [];
    URLRespostaIncorreta2QuizzCriado = [];
    respostaIncorreta3QuizzCriado = [];
    URLRespostaIncorreta3QuizzCriado = [];
    const titulos = document.querySelectorAll(".criacao-pergunta :nth-child(1)");
    const corPergunta = document.querySelectorAll(".criacao-pergunta :nth-child(2)");
    const respostaCorreta = document.querySelectorAll(".criacao-resposta-correta :nth-child(2)");
    const URLRespostaCorreta = document.querySelectorAll(".criacao-resposta-correta :nth-child(3)");
    const respostaIncorreta1 = document.querySelectorAll(".criacao-resposta-incorreta1 :nth-child(1)");
    const URLRespostaIncorreta1 = document.querySelectorAll(".criacao-resposta-incorreta1 :nth-child(2)");
    const respostaIncorreta2 = document.querySelectorAll(".criacao-resposta-incorreta2 :nth-child(1)");
    const URLRespostaIncorreta2 = document.querySelectorAll(".criacao-resposta-incorreta2 :nth-child(2)");
    const respostaIncorreta3 = document.querySelectorAll(".criacao-resposta-incorreta3 :nth-child(1)");
    const URLRespostaIncorreta3 = document.querySelectorAll(".criacao-resposta-incorreta3 :nth-child(2)");
    for (let i = 0; i < qtdPerguntasQuizzCriado; i++) {
        if (titulos[i].value < 20) {
            alert("Preencha os dados corretamente");
            i = qtdPerguntasQuizzCriado;
        } else if (respostaCorreta[i].value === "") {
            alert("Preencha os dados corretamente");
            i = qtdPerguntasQuizzCriado;
        } else if (!(URLRespostaCorreta[i].value.startsWith('https://') || URLRespostaCorreta[i].value.startsWith('http://'))) {
            alert("Preencha os dados corretamente");
            i = qtdPerguntasQuizzCriado;
        } else if (respostaIncorreta1[i].value === "") {
            alert("Preencha os dados corretamente");
            i = qtdPerguntasQuizzCriado;
        } else if (!(URLRespostaIncorreta1[i].value.startsWith('https://') || URLRespostaIncorreta1[i].value.startsWith('http://'))) {
            alert("Preencha os dados corretamente");
            i = qtdPerguntasQuizzCriado;
        } else if (respostaIncorreta2[i].value !== "") {
            if ((URLRespostaIncorreta2[i].value.startsWith('https://') || URLRespostaIncorreta2[i].value.startsWith('http://'))) {
                console.log("batatinha");
            } else {
                alert("Preencha os dados corretamente");
                i = qtdPerguntasQuizzCriado;
            }
        } else if (respostaIncorreta3[i].value !== "") {
            if ((URLRespostaIncorreta3[i].value.startsWith('https://') || URLRespostaIncorreta3[i].value.startsWith('http://'))) {
                console.log("batatinha");
            } else {
                alert("Preencha os dados corretamente");
                i = qtdPerguntasQuizzCriado;
            }
        }

        titulosPerguntasQuizzCriado.push(titulos[i].value);
        corPerguntasQuizzCriado.push(corPergunta[i].value);
        respostaCorretaQuizzCriado.push(respostaCorreta[i].value);
        URLRespostaCorretaQuizzCriado.push(URLRespostaCorreta[i].value);
        respostaIncorreta1QuizzCriado.push(respostaIncorreta1[i].value);
        URLRespostaIncorreta1QuizzCriado.push(URLRespostaIncorreta1[i].value);
        respostaIncorreta2QuizzCriado.push(respostaIncorreta2[i].value);
        URLRespostaIncorreta2QuizzCriado.push(URLRespostaIncorreta2[i].value);
        respostaIncorreta3QuizzCriado.push(respostaIncorreta3[i].value);
        URLRespostaIncorreta3QuizzCriado.push(URLRespostaIncorreta3[i].value);
        prosseguirCriacaoNiveis();
    }
}

function minimizarCaixaPerguntas(caixa) {
    const infoPergunta = caixa.nextElementSibling;
    infoPergunta.classList.toggle("escondido");
}