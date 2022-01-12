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
  console.log(pollId);
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    console.log("definied");
    return poll.theme
  }
  console.log("ej definied");
  return 'standard'
}

Data.prototype.deleteQuestion=function(pollId,currentIndex){
  this.polls[pollId].questions.splice(currentIndex, 1);
  this.polls[pollId].answers.splice(currentIndex, 1);
  this.polls[pollId].currentQuestion=currentIndex--;
}

Data.prototype.setQuestions=function(pollId, questions=-1){
  const poll = this.polls[pollId];
  if (questions !== -1){
    poll.selectedQuestions=questions;
  }
  poll.currentIndex=0;
  poll.users={};
  poll.currentQuestion=poll.selectedQuestions[poll.currentIndex];
  poll.answers=[];
}


Data.prototype.getAllQuestions=function(pollId){
  return this.polls[pollId].questions
}
Data.prototype.emptyAwnser=function(pollId){
  const poll = this.polls[pollId];
    for (let i = 0; i < poll.questions.length; i++){
      for (let x = 0; x < poll.questions[i].a.length; x++){
          console.log(poll.questions[i].a[x].length===0);
          if( poll.questions[i].a[x].length===0){
            poll.questions[i].a.splice(x,1);
            console.log(poll.questions[i].a);
            x = x-1;
          }
    }
}
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;
    poll.theme = 'standard';
    poll.selectedQuestions=[];
    poll.currentIndex = 0;
    poll.users={};
    poll.time=0;
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.setTimer=function(pollId,time){
  this.polls[pollId].time=time;
}

Data.prototype.sendTime=function(pollId){
  return this.polls[pollId].time
}

Data.prototype.chooseTheme = function (pollId, theme) {
  this.polls[pollId].theme=theme;
  console.log(this.polls[pollId].theme);
}

Data.prototype.addQuestion = function(pollId, first) {
  const poll = this.polls[pollId];
  let q= {q: "", a: ["","","",""], c:[]};
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

Data.prototype.submitAnswer = function(pollId, answer, userName, time) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  console.log(poll);
  if (typeof poll !== 'undefined') {
    poll.users[userName].votings[poll.currentQuestion]=answer;
    const correctAnswers=poll.questions[poll.currentQuestion].c;
    const answerOptions = poll.questions[poll.currentQuestion].a;
    for (let i=0; i<correctAnswers.length;i++){
      if (answerOptions[correctAnswers[i]]==answer){
        poll.users[userName].points+=10*(1.5*time);
      }
    }
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
    console.log(poll.users);
    console.log(poll.users[userName].points);
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
Data.prototype.returnUsers=function(pollId){
  const poll = this.polls[pollId];
  let pointsAndUsers = [];
  for (let a in poll.users){
    pointsAndUsers.push([a, poll.users[a].points]);
  }
  pointsAndUsers.sort(function(a,b){return b[1] - a[1];});
  return pointsAndUsers
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
  poll.questions[poll.currentQuestion].c=correct;
}

Data.prototype.addUser=function(pollId,user){

  const poll = this.polls[pollId];
  const u= poll.users;
  let thisUser= {};
  thisUser.points=0;
  thisUser.votings=[];
  if(typeof u !== 'undefined'){
    for (let x in u){
      console.log(u);
      if(x===user){
        return true
      }
    }
  }

  u[user]=thisUser;
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

Data.prototype.getUsers=function(pollId){
  const poll = this.polls[pollId];
  const pollUsers = poll.users;
  if (typeof pollUsers !== 'undefined'){
    return Object.keys(poll.users)
  }
  return []
}

Data.prototype.userInfo=function(pollId,userName){
  const poll = this.polls[pollId];
  const user= poll.users[userName];
  const answer = user.votings[poll.currentQuestion];
  let isCorrect=false;
  const correctAnswers=poll.questions[poll.currentQuestion].c;
  const answerOptions = poll.questions[poll.currentQuestion].a;
  for (let i=0; i<correctAnswers.length;i++){
    if (answerOptions[correctAnswers[i]]==answer){
      isCorrect=true;
    }
  }

  return {answer: poll.users[userName].votings[poll.currentQuestion],
          correct: isCorrect,
          score: user.points}
}

Data.prototype.getPolls=function(){
  return Object.keys(this.polls)
}

Data.prototype.addAnswers=function(pollId,questionNumber,answers){
  const poll = this.polls[pollId];
  poll.currentQuestion=questionNumber;
  poll.questions[poll.currentQuestion].a=answers;
}

Data.prototype.saveQuestions=function(pollId, questions){
  const poll = this.polls[pollId];
  poll.questions=questions;
}

Data.prototype.removeOption=function(pollId, currentQuestion, index){
  const poll = this.polls[pollId];
  poll.currentQuestion=currentQuestion;
  poll.questions[poll.currentQuestion].c.splice(index);
}


module.exports = Data;
