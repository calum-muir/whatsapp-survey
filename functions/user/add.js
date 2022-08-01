const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  base(context.USER_TABLE_NAME).create([
  {
    "fields": {
      "phone": event.phone,
      "name": event.name,
      "status": "progress"
    }
  }
  ], function(err, records){
      if(err) {
        callback("There was an error adding the user", err);
      }
      else {
      callback(null, {});
      }
  }) 
};
