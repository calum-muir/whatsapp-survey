const airtable = require('airtable');
const twilio = require('twilio');

exports.handler = function(context, event, callback) {
  let client = context.getTwilioClient();
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  

  if (!isFormattedCorrectly(event)) {
    const missingKeyError = {statusCode: 400, message: "Missing quiz_key parameter in body"}
    callback(JSON.stringify(missingKeyError))
  }

  if (isAuthorized(event, context)) {
    
    client.studio.v2.flows(context.QUIZ_FLOW_SID)
                    .executions
                    .list()
                    .then(executions => {
                        const executionPromises = []
                        executions.forEach(execution => {
                            if (execution.status === 'active') {
                                const executionPromise = client.studio.v2.flows(context.QUIZ_FLOW_SID)
                                    .executions(execution.sid)
                                    .update({status: 'ended'})
                                executionPromises.push(executionPromise) 
                            } 
                        })
                        Promise.allSettled(executionPromises)
                        .then(executions => {
                            callback(null, "200 - Success")
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => {console.log(err); callback(err)})
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