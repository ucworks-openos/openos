async function parseXmlToJSON(xmldata) {
    return new Promise(function(resolve, reject) {
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();

        parser.parseString(xmldata, function(err, result) {
            if (err) {
                reject(err)
                return;
            }

            resolve(result);
        });
    });
}

module.exports = {
    parseXmlToJSON: parseXmlToJSON,
}