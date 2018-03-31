const couchbase = require('couchbase');
const cluster = new couchbase.Cluster('couchbase://localhost/');
cluster.authenticate('Administrator', 'password');
const bucket = cluster.openBucket('new-bucket');
const N1qlQuery = couchbase.N1qlQuery;

bucket.manager().createPrimaryIndex(() => {
    bucket.upsert('user:king_arthur', {
        'email': 'kingarthur@couchbase.com',
        'interests': [
            'Holy Grail',
            'African Swallows'
        ]
    }, (err, result) => {
        bucket.get('user:king_arthur', (err, result) => {
            console.log('Got result: %j', result.value);
            bucket.query(N1qlQuery.fromString('SELECT * FROM `new-bucket` WHERE $1 in interests LIMIT 1'),
                ['African Swallows'],
                (err, rows) => {
                    console.log('Got rows: %j', rows);
                });
        });
    });
});
