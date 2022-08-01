const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const getQuestion = require(Runtime.getAssets()['/getQuestion.js'].path)

  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  base(context.EVENTS_TABLE_NAME).select({
    filterByFormula: `{phone} = "${event.phone}"`
  }).firstPage((err, events) => {
    if(err){
      console.log(err)
      reject("Error in your request", err);
    }
    if(events.length < 1){
      console.log("Event not found")
      reject("Question not found");
    }
    else{
      let promises = []
      let answers = []
      let userChoices = []
      events.forEach((event) => {
        userChoices.push({questionNum: event.fields.question_num, quizNum: event.fields.quiz_num, userChoice: event.fields.user_choice})
        promises.push(getQuestion(context.QUESTIONS_TABLE_NAME, base, event))
      })
      Promise.allSettled(promises)
        .then((questions) => {
          questions.forEach((question) => {
            if(question.value){
              let yourAnswer = userChoices.filter((choice) => (choice.questionNum == question.value.question_num && choice.quizNum == question.value.quiz_num))[0].userChoice
              let rightAnswer = question.value.answer
              answers.push({
                "question": question.value.question, 
                "yourAnswer": question.value[`choice_${yourAnswer}`],
                "rightAnswer": question.value[`choice_${rightAnswer}`],
                "correct": yourAnswer == rightAnswer? true: false
              })
            }
          })
          callback(null, answers)
        })
        .catch(err => console.log(err)); 
    }
  })
};

