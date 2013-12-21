module.exports = function () {
    this.Given(/^I am in the project folder$/, function(callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.When(/^I run "([^"]*)"$/, function(file, callback) {
        // express the regexp above with the code you wish you had
        callback();
    });

    this.Then(/^I should see result:$/, function(table, callback) {
        callback();
    });

    this.Then(/^Exit code should be "([^"]*)"$/, function(arg1, callback) {
        callback();
    });
};
