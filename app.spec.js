let request = require("request");

let base_url = "http://localhost:2000/";

describe("Server", () => {
    describe("GET /", () => {
        it("returns status code 200", (done) => {
            request.get(base_url, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
    describe("GET /viewUsers", () => {
        it("to contain a table", (done) => {
            beforeEach(()=>{
                request.post({
                    url: base_url+'/viewUsers',
                    form: {
                        id: 1,
                        userId: 'fkdlajfda',
                        name: 'Alex',
                        email: 'alex@alex.com',
                        age: 18
                    }
                }, (error, response, body)=>{})
            });
            request.get(base_url, (error, response, body) => {
                expect(response.body).toContain(`<table></table>`);
                done();
            });
        });
    });
});