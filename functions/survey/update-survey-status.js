const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  base(context.SURVEY_STATUS_TABLE_NAME).select({
      filterByFormula: `AND(({phone} = "${event.phone}"), ({survey_id} = "${event.survey_id}") )`
  }).firstPage((err, surveys) => {
      if(err){
          callback("Error in your request", err);
      }
      if(surveys.length < 1){
        console.log("Survey record not found. Creating it...")
        base(context.SURVEY_STATUS_TABLE_NAME).create([
          {
            "fields": {
              "phone": event.phone,
              "survey_id": event.survey_id,
              "status": parseInt(event.status)
            }
          }
          ], function(err, records){
              if(err) {
                console.log(err)
                callback("Could not add survey to survey status", err);
              }
              else {
              callback(null, {});
              }
          })
      } else {

        console.log("Survey record found. Updating it...")

        const survey = surveys[0]
        const updateObject = [{
          "id": survey.id,
          "fields": {
            "status": parseInt(event.status)
          }
        }]

        base(context.SURVEY_STATUS_TABLE_NAME).update(
          updateObject
        , (err, records) => {
          if (err) {
            console.error(err);
            callback(err);
          }
          callback(null, "Status Updated")
        })
      }
  })
};



