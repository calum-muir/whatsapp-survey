const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  const isCorrect = (event.correct == 'true') ? true : false 
  base(context.EVENTS_TABLE_NAME).create([
  {
    "fields": {
      "phone": event.phone,
      "survey_id": event.survey_id,
      "question_num": parseInt(event.question_num),
      "user_choice": parseInt(event.user_choice),
      "status": parseInt(event.status)
    }
  }
  ], function(err, records){
      if(err) {
        console.log(err)
        callback("Could not add the event", err);
      }
      else {
      callback(null, {});
      }
  })

  
};
