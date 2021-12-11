'use strict';

const languages = ["en", "se"];

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const ui = require("./data/labels-" + lang + ".json");
  return ui;
}

Data.prototype.getTheme=function(pollId) {
  return this.polls[pollId].theme
}

Data.prototype.deleteQuestion=function(pollId,currentIndex){
  this.polls[pollId].questions.splice(currentIndex, 1);
  this.polls[pollId].answers.splice(currentIndex, 1);
  this.polls[pollId].currentQuestion=currentIndex--;
}

Data.prototype.setQuestions=function(pollId,questions){
  const poll = this.polls[pollId];
  poll.selectedQuestions=questions;
  poll.currentQuestion=poll.selectedQuestions[poll.currentIndex];

}

Data.prototype.getAllQuestions=function(pollId){
  return this.polls[pollId].questions
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;
    poll.theme ='standard';
    poll.selectedQuestions=[];
    poll.currentIndex = 0;
    poll.users={};
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.chooseTheme = function (pollId, theme) {
  this.polls[pollId].theme=theme;
  console.log(this.polls[pollId].theme);
}

Data.prototype.addQuestion = function(pollId, first) {
  const poll = this.polls[pollId];
  let q= {q: "", a: ["","","",""], c:null};
  if (typeof poll !== 'undefined') {
    if ((first && poll.questions.length<1) || (!first)){
      poll.questions.push(q);
      console.log("question added to", pollId, q);
    }
  }
}

Data.prototype.getQuestion = function(pollId, qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
        poll.currentIndex = qId;
        poll.currentQuestion = poll.selectedQuestions[poll.currentIndex];
    }
    else {
      poll.currentQuestion = poll.selectedQuestions[poll.currentIndex];
    }
    return poll.questions[poll.currentQuestion];
  }
  return []
}

Data.prototype.submitAnswer = function(pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  console.log(poll);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined')
      answers[answer] = 1;
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
    console.log(poll);
  }
}

Data.prototype.updateQuestion = function(d){
  const poll = this.polls[d.pollId];
  poll.currentQuestion=d.questionNumber;
  poll.questions[poll.currentQuestion].q=d.q;
  poll.questions[poll.currentQuestion].a=d.a;
}

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {q: poll.questions[poll.currentQuestion].q, a: answers};
    }
  }
  return {}
}

Data.prototype.setAnswersZero=function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    let pollAnswers = poll.questions[poll.currentQuestion].a;
    answers = {};
    for (let i = 0; i < pollAnswers.length; i++){
        answers[pollAnswers[i]] = 0;
    }
    poll.answers.push(answers);
}
}

Data.prototype.removeAnswerOption=function(d){
  const poll = this.polls[d.pollId];
  poll.questions[d.questionNumber].a.splice(d.answerIndex, 1);
}

Data.prototype.addIndex=function(pollId){
  const poll = this.polls[pollId];
  poll.currentIndex++;
  poll.currentQuestion=poll.selectedQuestions[poll.currentIndex];
}

Data.prototype.checkIfFinished=function(pollId){
  const poll = this.polls[pollId];
  console.log((poll.currentIndex));
  if (poll.selectedQuestions.length===(poll.currentIndex+1)){
    console.log("nu är jag sann");
    return true
  }
  return false
}

Data.prototype.markCorrect=function(pollId, qId,correct){
  const poll = this.polls[pollId];
  poll.currentQuestion=qId;
  console.log(poll.currentQuestion);
  console.log(poll.questions[poll.currentQuestion].q);
  poll.questions[poll.currentQuestion].c=correct;
  console.log("correct index is", poll.questions[poll.currentQuestion].c);
}

Data.prototype.addUser=function(pollId,user){

  const poll = this.polls[pollId];
  const u= poll.users;
  let c=0;
  let p= { points:c}
  if(typeof u !== 'undefined'){
  for (let x in u){
    console.log(u);
    if(x===user){
    return true
  }
    }
  }

  u[user]=p;
  console.log(u);

  return false
  }


Data.prototype.allIDs=function(pollId){
  let exist=false;
for (let p in this.polls){
  if(p===pollId){
  return true
  }
}
return false
}


module.exports = Data;
