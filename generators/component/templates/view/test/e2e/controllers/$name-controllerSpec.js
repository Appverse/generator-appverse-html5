//
// test/e2e/controllers/controllersSpec.js
//
describe("E2E: Testing <%=name%>", function () {

    beforeEach(function () {
        browser().navigateTo('/');
    });

    it('should have a working <%=name%> page ', function () {
        browser().navigateTo('#/<%=name%>');
        expect(browser().location().path()).toBe("/<%=name%>");
        expect(element('[class="lead"]').html()).toContain('<%=name%>');
    });

});
