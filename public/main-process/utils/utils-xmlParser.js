async function parseXmlToJSON(xmldata) {
    return new Promise(function (resolve, reject) {
        var xml2js = require('xml2js');
        // explicitArray: 배열로 감싸지 않음, mergeAttrs: $ 객체 하위에 있는 속성을 부모 요소에 붙임.
        var parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

        parser.parseString(xmldata, function (err, result) {
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