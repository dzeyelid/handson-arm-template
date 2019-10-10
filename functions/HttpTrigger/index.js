module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        const name = (req.query.name || req.body.name);
        const res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + name
        };
        context.bindings.outputLogToBlob = JSON.stringify(res);
        context.res = res;
    }
    else {
        const res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
        context.bindings.outputLogToBlob = JSON.stringify(res);
        context.res = res;
    }
};