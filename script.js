const paginaQuiz = document.querySelector('.paginaQuiz')

function abrirQuiz(){
    let promessaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/105');
    promessaQuiz.then(sucessoQuiz)
    promessaQuiz.catch(erroQuiz)
}
function sucessoQuiz(resposta){
    console.log(resposta.data)
    paginaQuiz.innerHTML=""
    paginaQuiz.innerHTML=`<div class="escurece"><img class="bannerImg" src="${resposta.data.image}"></img></div>`
}
function erroQuiz(resposta){
    console.log(resposta)
}
abrirQuiz()