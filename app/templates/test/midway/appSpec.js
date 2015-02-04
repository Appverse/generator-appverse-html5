//
// test/midway/appSpec.js
//
describe("Midway: Testing Modules", function () {
    describe("App Module:", function () {

        var module;
        before(function () {
            module = angular.module("<%=appName%>App");
        });

        it("should be registered", function () {
            expect(module).not.to.equal(null);
        });

        describe("Dependencies:", function () {

            var deps;
            var hasModule = function (m) {
                return deps.indexOf(m) >= 0;
            };
            before(function () {
                deps = module.value('<%=appName%>App').requires;
            });

            //you can also test the module's dependencies
            it("should have COMMONAPI as a dependency", function () {
                expect(hasModule('COMMONAPI')).to.equal(true);
            });
        });
    });
});
