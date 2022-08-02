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
        surveyObject.survey_id = ""
        surveyObject.start = "false"
          callback(null, "No available surveys");
      }
      else {
        const surveyObject = {}
        surveyObject.surveyId = ""
        surveyObject.start = "false"
        base(context.SURVEY_DETAILS_TABLE_NAME).select({
            view: 'Grid view'
        }).firstPage((err, records) => {
            if (err) { console.error(err); callback(err); }
            records.forEach((record) => {
                console.log('Retrieved', record.get('survey_id'));
                surveyObject.surveyId += checkMessageForSurveyId(event.message, record)
            });
            
            if (surveyObject.surveyId) {
                surveyObject.start = "true"
            }
            console.log(surveyObject)
            callback(null, surveyObject)
        });
      }
  })
};

const checkMessageForSurveyId = (message, survey) => {
   const words = message.split(" ")
   if (words.find(word => word.toLowerCase() == survey.get('survey_id').toLowerCase())) {
        return survey.get('survey_id')
   } else {
    return ""
   }
}