const airtable = require('airtable');
const findUser = require(Runtime.getFunctions()['user/find'].path)

exports.handler = function(context, event, callback) {
  const base = new airtable({apiKey: context.AIRTABLE_API_KEY}).base(context.AIRTABLE_BASE_ID)
  var user = []
  base(context.USER_TABLE_NAME).select().all()
    .then(results => {
        user = results.filter(result => result.fields.phone == event.phone)
        if(user.length > 0){
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
                    "phone": record.fields.phone})
              });
            });
        }
  })
  // findUser.findUser(base, "4917665045681")
  //   .then(user =>{
  //     console.log("User is", user);
  //   })
  
};
