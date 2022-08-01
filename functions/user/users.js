const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  base(context.USER_TABLE_NAME).select().all()
    .then(records => {
        var users = records.map(result => result.fields)
        if(users.length < 1){
            callback("User not found");
        }
        else{
            callback(null, users);
        }
    }) 
};

