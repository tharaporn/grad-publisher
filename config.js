module.exports = {
  mongo_connect: {
    //host: 'localhost',
    host: '10.10.20.75',
    port: 27017,
    db: 'charge',
  },
  authorization: {
    mongodb:{
     host: '10.10.20.75',
     port: 27017,
     db: 'charge',
     collection_name: 'user',
     autoReconnect: true,
     poolSize: 4
    }
  },
  site: {
    //baseUrl: the URL that mongo express will be located at
    //Remember to add the forward slash at the end!
    baseUrl: 'http://localhost:8085/',
    port: 8085,
    cookieSecret: 'cookiesecret',
    sessionSecret: 'sessionsecret'
  }
};
