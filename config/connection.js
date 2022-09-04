const MONGO_CLIENT = require('mongodb').MongoClient;


const connection= {

     STATE : {
        db: null
    },

    connection: (done) => {
        const URL = 'mongodb://localhost:27017'
        const DB_NAME = "Website"

        MONGO_CLIENT.connect(URL, (err, data) => {
            if (err) {
                return done(err)
            } else {
                connection.STATE.db = data.db(DB_NAME)
                done()
            }
        })
    },

    get: () => {
        return connection.STATE.db
    }

}

module.exports=connection