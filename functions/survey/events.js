const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  const isCorrect = (event.correct == 'true') ? true : false 
  base(context.EVENTS_TABLE_NAME).create([
  {
    "fields": {
      "phone": event.phone,
      "quiz_num": parseInt(event.quiz_num),
      "question_num": parseInt(event.question_num),
      "user_choice": parseInt(event.user_choice),
      "correct": isCorrect
    }
  }
  ], function(err, records){
      if(err) {
        console.log(err)
        callback("Could not add the event", err);
      }
      // else {
      // callback(null, {});
      // }
  })

  base(context.USER_TABLE_NAME).select().all()
    .then(results => {
        user = results.filter(result => result.fields.phone == event.phone)
        if(user.length > 0){
            if(isCorrect){
                user[0].fields.total_points += parseInt(event.points)
            }
            base(context.USER_TABLE_NAME).update([
              {
                "id": user[0].id,
                "fields": user[0].fields
              }
            ], function(err, records) {
              if (err) {
                callback(null, {"Status": "Error"})
                return;
              }
              records.forEach(function(record) {
                callback(null, {"name": record.fields.name, 
                    "phone": record.fields.phone, 
                    "points": record.fields.total_points})
              });
            });
        }
    })
};
