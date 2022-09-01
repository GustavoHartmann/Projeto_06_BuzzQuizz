const paginaQuiz = document.querySelector('.paginaQuiz');
const conteudo = document.querySelector('.conteudo');
const container = document.querySelector('.container');
const statusCode404 = 404;
let tituloQuizzCriado = "";
let URLImagemQuizzCriado = "";
let qtdPerguntasQuizzCriado = 0;
let qtdNiveisQuizzCriado = 0;

function abrirQuiz() {
    let promessaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/5000');
    promessaQuiz.then(sucessoQuiz)
    promessaQuiz.catch(erroQuiz)
}
function sucessoQuiz(resposta) {
    console.log(resposta.data)
    conteudo.innerHTML =
        `<div class="banner">
        <img class="bannerImg" src="${resposta.data.image}"></img>
        <h1>${resposta.data.title}</h1>
    </div>`

    for (let i = 0; i < resposta.data.questions.length; i++) {
        resposta.data.questions[i].answers.sort(comparador)

        container.innerHTML += `
        <div class="questaoDiv p${i}">
            <div class="titulo">${resposta.data.questions[i].title}</div>
            <div class=respostasDiv></div>
        </div>`

        let respostasDiv = document.querySelector(`.p${i} .respostasDiv`)
        for (let j = 0; j < resposta.data.questions[i].answers.length; j++) {

            respostasDiv.innerHTML +=
                `<div class="resposta">
                        <img class="imgResposta" src="${resposta.data.questions[i].answers[j].image}"></img>
                        <span class="textoResposta">${resposta.data.questions[i].answers[j].text}<span>
                    </div>`}
    }
}
function erroQuiz(resposta) {
    console.log(resposta)
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
        <button class="botao prosseguir-perguntas" onclick="checarInformacoesBasicas()">Prosseguir para criar perguntas</button>
    </div>
    `
}

function checarInformacoesBasicas() {
    tituloQuizzCriado = document.querySelector(".caixa-criacao :nth-child(1)").value;
    URLImagemQuizzCriado = document.querySelector(".caixa-criacao :nth-child(2)").value;
    qtdPerguntasQuizzCriado = Number(document.querySelector(".caixa-criacao :nth-child(3)").value);
    qtdNiveisQuizzCriado = Number(document.querySelector(".caixa-criacao :nth-child(4)").value);
    if (tituloQuizzCriado.length >= 20 && tituloQuizzCriado.length <= 65 && (URLImagemQuizzCriado.startsWith('https://') || URLImagemQuizzCriado.startsWith('http://')) && qtdPerguntasQuizzCriado >= 3 && qtdNiveisQuizzCriado >= 2) {
        console.log("valido");
    } else {
        alert("Preencha os dados corretamente");
    }
}