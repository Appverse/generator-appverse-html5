//
// test/midway/controllers/controllersSpec.js
//
describe("Midway: Testing Controllers", function () {

    var tester;
    beforeEach(function () {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('<%=appName%>App', {
            template: '<div><div ui-view></div></div>'
        });
    });

    it('should load the view home.html properly when /home route is accessed', function (done) {
        tester.visit('/home', function () {
            expect(tester.path()).to.equal('/home');
            var current;
            tester.until(function () {
                current = tester.inject('$state').current;
                return current.templateUrl;
            }, function () {
                expect(current.templateUrl).to.equal('views/home.html');
                done();
            });
        });
    });

    it('should load the view tasks.html properly when /tasks route is accessed', function (done) {
        tester.visit('/tasks', function () {
            expect(tester.path()).to.equal('/tasks');
            var current;
            tester.until(function () {
                 current = tester.inject('$state').current;
                return current.templateUrl;
            }, function () {
                expect(current.templateUrl).to.equal('views/tasks/tasks.html');
                done();
            });
        });
    });
});
