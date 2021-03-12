let envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../Users');
let Movies = require('../Movies');
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

let actor1 = {
    ActorName: 'Keanu Reeves',
    CharacterName: 'Neo'
}

let actor2 = {
    ActorName: 'Laurence Fishburne',
    CharacterName: 'Morpheus'
}

let actor3 = {
    ActorName: 'Carrie-Anne Moss',
    CharacterName: 'Trinity'
}


let movies_post_test = {
    title: 'The Matrix',
    releaseYear: '2008',
    genre: 'Action',
    actors: [actor1, actor2, actor3]
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
        //Movies.deleteOne({title: 'The Matrix'}, function(err, movies) {
            //if (err) throw err;
        //});
        Movies.findOneAndUpdate( {title: 'Requiem for a Dream'}, {releaseYear: 2000}, function(err, movie) {
            if (err) throw err;
        })
        done();
    })

    //Test the GET route
    describe('/signup', () => {
        it('it should register, login and check our token', (done) => {
            chai.request(server)
                .post('/signup')
                .send(login_details)
                .end((err, res) =>{
                    console.log(JSON.stringify(res.body));
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

    describe('/movies GET test', () => {
        it('should respond with status code 200 and the req information', (done) => {
            chai.request(server)
                .get('/movies')
                .set('Authorization', test_user.jwt_token)
                .send({message: 'Requiem for a Dream'})
                .end((err, res) =>{
                    res.should.have.status(200);
                    done();
                })
        })
    });

    describe('/movies POST test', () => {
        it('should respond with status code 200 and the message movie saved', (done) => {
            chai.request(server)
                .post('/movies')
                .set('Authorization', test_user.jwt_token)
                .send(movies_post_test)
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.have.property('message').equal('movie saved');
                    done();
                })
        })
    });

    describe('/movies PUT test', () => {
        it('update the movie releaseyear based on a db query of a title, requires JWT auth', (done) => {
            chai.request(server)
                .put('/movies')
                .set('Authorization', test_user.jwt_token)
                .send({title: 'Requiem for a Dream', releaseYear: 2001})
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.have.property('message').equal('movie updated with the correct release year');
                    res.body.should.have.property('new_releaseYear').equal(2001);
                    done();
                })
        })
    });

    describe('/movies DELETE test', () => {
        it('delete requires JWT auth and send back the msg movie deleted', (done) => {
            chai.request(server)
                .delete('/movies')
                .set('Authorization', test_user.jwt_token)
                .send({title: 'The Matrix'})
                .end((err, res) =>{
                    res.should.have.status(200);
                    res.body.should.have.property('message').equal('movie deleted');
                    done();
                })
        })
    });
});
