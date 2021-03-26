let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../Users');
let Movies = require('../Movies');
let Reviews = require('../Reviews');
chai.should();

chai.use(chaiHttp);

let login_details = {
    name: 'test1',
    username: 'email@email.com',
    password: '123@abc'
}

let test_user = {
    jwt_token: 'empty until filled by signin function.'
}

let reviews_post_test = {
    movieid: 'The Bourne Legacy',
    comment: 'Boring Action Movie...',
    rating: 1,
}


describe('Register, Login and Call Test Collection with Basic Auth and JWT Auth', (done) => {
    beforeEach( (done) => { //before each test initialize the db to empty
        //db.userList = [];

        done();
        })

    after((done) => { //after this test suite empty the db
        //db.userList = [];
        User.deleteOne({name: 'test1'}, function(err, user) {
            if (err) throw err;
        });
        Reviews.deleteOne( {movieid: 'The Bourne Legacy', comment: 'Boring Action Movie...'}, function (err) {
            if (err)  throw err;
        });
        done();
    })

    //Test the GET route
    describe('/signup', () => {
        it('it should register, login and check our token', (done) => {
            chai.request(server)
                .post('/signup')
                .send(login_details)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    //follow-up to get the JWT token
                    chai.request(server)
                        .post('/signin')
                        .send(login_details)
                        .end((err, res) => {
                            test_user.jwt_token = res.body.token; //saving this for other request tests
                            res.should.have.status(200);
                            done();
                        })
                })
        })
    });

    describe('/reviews GET test', () => {
        it('should respond with the movie information requested without reviews', (done) => {
            chai.request(server)
                .get('/reviews')
                .send( {reviews: false, title: 'Requiem for a Dream'})
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    });

    describe('/reviews POST test', () => {
        it('should respond with status code 200 and the message review saved', (done) => {
            chai.request(server)
                .post('/reviews')
                .set('Authorization', test_user.jwt_token)
                .send(reviews_post_test)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.have.property('message').equal('review has been added.');
                    done();
                })
        })
    });

    describe('/reviews GET test', () => {
        it('should respond with the movie information requested AND reviews', (done) => {
            chai.request(server)
                .get('/reviews')
                .send( {reviews: true, title: 'Requiem for a Dream'})
                .end((err, res) => {
                    res.body.should.have.property('movie_reviews');
                    res.should.have.status(200);
                    done();
                })
        })
    });
});
