const airtable = require('airtable');

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  base(context.USER_TABLE_NAME).select().all()
    .then(results => {
        var users = results.filter(result => result.fields.phone == event.phone)
        if(users.length < 1){
            callback("User not found");
        }
        else{
            callback(null, users[0].fields);
        }
        
    }) 
};

exports.findUser = async function(base, phone) {
  await base(context.USER_TABLE_NAME).select().all()
    .then(results => {
        return (results.filter(result => result.fields.phone == phone))
    })
}
