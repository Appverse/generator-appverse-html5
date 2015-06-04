//
// test/e2e/controllers/controllersSpec.js
//
describe("E2E: Testing <%=viewName%>", function () {

    beforeEach(function () {
        browser().navigateTo('/');
    });

    it('should have a working <%=viewName%> page ', function () {
        browser().navigateTo('#/<%=viewName%>');
        expect(browser().location().path()).toBe("/<%=viewName%>");
        expect(element('[class="lead"]').html()).toContain('<%=viewName%>');
    });

});
