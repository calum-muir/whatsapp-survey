const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  base(context.SURVEY_STATUS_TABLE_NAME).select({
      filterByFormula: `AND(({phone} = "${event.phone}"), ({status} != "-1") )`
  }).firstPage((err, surveys) => {
      if(err){
          callback("Error in your request", err);
      }
      if(surveys.length < 1){
        console.log("No more available surveys")
        const surveyObject = {}
        surveyObject.message = "none"
          callback(null, "No available surveys");
      }
      else {
        const surveyObject = {}
        surveyObject.message = ""
        base(context.SURVEY_DETAILS_TABLE_NAME).select({
            view: 'Grid view'
        }).firstPage((err, records) => {
            if (err) { console.error(err); callback(err); }
            records.forEach((record) => {
                console.log('Retrieved', record.get('survey_id'));
                const result = surveys.find(survey => survey.fields.survey_id == record.get('survey_id'))
                //console.log(result)
                if (surveys.find(survey => survey.fields.survey_id == record.get('survey_id'))) {
                    const tempMessage = `${record.get('survey_id')} - The \"${record.get('survey_description')}\" survey takes about ${record.get('time')} to complete and has a $${record.get('reward')} reward. \n\n`
                    surveyObject.message += tempMessage
                }
            });
            console.log(surveyObject)
            callback(null, surveyObject)
        });
      }
  })
};