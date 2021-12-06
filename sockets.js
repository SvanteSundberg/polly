function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('loadTheme', function (pollId) {
    socket.emit('initial', data.getTheme(pollId));
  });

  socket.on('createPoll', function(d) {
    console.log('pollid:'+d.pollId);
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
  });

  socket.on('chooseTheme', function(d) {
    console.log(d.pollId);
    console.log(d.theme);
    data.chooseTheme(d.pollId, d.theme);
  });

  socket.on('changeQuestion', function(d){
    data.updateQuestion(d);
    socket.emit('getQuestions', data.getAllQuestions(d.pollId));
  });


  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, d.first);
    socket.emit('getQuestions',data.getAllQuestions(d.pollId));
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('joinPoll', function(d) {
    socket.join(d.pollId);
    socket.emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("recieveQuestions", function(pollId){
    console.log('hej')
    socket.emit('getQuestions',data.getAllQuestions(pollId));
  });

  socket.on("pollQuestions", function(d){
    console.log("steg 2")
    socket.emit('selectedQuestions',data.setQuestions(d.pollId,d.selectQ));
  });

  socket.on("loadSelectedQuestions", function(pollId){
    socket.emit("selectedQuestions",data.getSelectedQuestions(pollId))
  });


}

module.exports = sockets;
