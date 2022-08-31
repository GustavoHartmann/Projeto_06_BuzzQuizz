const paginaQuiz = document.querySelector('.paginaQuiz')

function abrirQuiz(){
    let promessaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/5000');
    promessaQuiz.then(sucessoQuiz)
    promessaQuiz.catch(erroQuiz)
}
function sucessoQuiz(resposta){
    console.log(resposta.data)
    paginaQuiz.innerHTML=
    `<div class="banner">
        <img class="bannerImg" src="${resposta.data.image}"></img>
        <h1>${resposta.data.title}</h1>
    </div>`
    
    for (let i=0; i<resposta.data.questions.length; i++){
        resposta.data.questions[i].answers.sort(comparador)

        paginaQuiz.innerHTML+=`
        <div class="questaoDiv p${i}">
            <div class="titulo">${resposta.data.questions[i].title}</div>
            <div class=respostasDiv></div>
        </div>`

        let respostasDiv = document.querySelector(`.p${i} .respostasDiv`)
        for (let j=0; j<resposta.data.questions[i].answers.length; j++){
        
            respostasDiv.innerHTML+=
                    `<div class="resposta">
                        <img class="imgResposta" src="${resposta.data.questions[i].answers[j].image}"></img>
                        <span class="textoResposta">${resposta.data.questions[i].answers[j].text}<span>
                    </div>`}
    }
}
function erroQuiz(resposta){
    console.log(resposta)
}
abrirQuiz()

function comparador() { 
	return Math.random() - 0.5; 
}