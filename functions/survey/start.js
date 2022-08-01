const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  let client = context.getTwilioClient();
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  

  if (!isFormattedCorrectly(event)) {
    const startKeyError = {statusCode: 400, message: "Missing quiz_key parameter in body"}
    callback(JSON.stringify(startKeyError))
  }

  if (isAuthorized(event, context)) {
    base(context.USER_TABLE_NAME).select().all()
    .then(users => {
        users.forEach(function(user){
            console.log(user.fields.phone, " is the phone number")

            let fromNumber = context.QUIZ_PHONE_NUMBER
            const toNumber = user.fields.phone

            // if (isWhatsapp(toNumber)) {
            //     fromNumber = `whatsapp:${context.QUIZ_PHONE_NUMBER}`
            // }

            client.studio.v2.flows(context.QUIZ_FLOW_SID)
                            .executions
                            .create({parameters: {
                                survey_num: event.survey_num
                             }, to: toNumber, from: fromNumber})
                            .then(execution => callback(null, execution.sid));
        })}
    )
    .catch(err => console.log(err))
  } else {
    const unauthorizedError = {statusCode: 401, message: "Unauthorized"}
    callback(JSON.stringify(unauthorizedError))
  }

  
};


const isAuthorized = (event, context) => {
    const quiz_key = context.QUIZ_KEY
    console.log(event)
    if (event.quiz_key === quiz_key) {
        return true
    } else {
        return false
    }
}

const isFormattedCorrectly = (event) => {
    if (event.quiz_key) {
        return true
    } else {
        return false
    }
}

const isWhatsapp = (toNumber) => {
    if (toNumber.startsWith('whatsapp')) {
        return true
    } else {
        return false
    }
}