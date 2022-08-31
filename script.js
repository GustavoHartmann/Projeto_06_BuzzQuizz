const paginaQuiz = document.querySelector('.paginaQuiz');
const conteudo = document.querySelector('.conteudo');
const statusCode404 = 404;

function abrirQuiz() {
    let promessaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/105');
    promessaQuiz.then(sucessoQuiz)
    promessaQuiz.catch(erroQuiz)
}
function sucessoQuiz(resposta) {
    console.log(resposta.data)
    paginaQuiz.innerHTML = ""
    paginaQuiz.innerHTML = `<div class="escurece"><img class="bannerImg" src="${resposta.data.image}"></img></div>`
}
function erroQuiz(resposta) {
    console.log(resposta)
}
//abrirQuiz()

function BuscarQuizzes() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promessa.then(ListarQuizzes);
    promessa.catch(tratarErroBuscarQuizzes);
}

BuscarQuizzes();

function ListarQuizzes(resposta) {
    const listaQuizzes = resposta.data;
    const quizzes = document.querySelector(".quizzes");

    for (let i = 0; i < listaQuizzes.length; i++) {
        quizzes.innerHTML += `
            <div class="quizz">
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