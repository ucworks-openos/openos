const SITE_CONFIG_FILE = 'site.cfg';


/**
 * 사이트 Config파일을 로드합니다.
 */
function readConfig() {

	try {
		const fs = require('fs');

		let rawdata = fs.readFileSync(SITE_CONFIG_FILE);
		global.SITE_CONFIG = JSON.parse(rawdata);

		console.log("siteConfig read completed!", global.SITE_CONFIG)
	} catch (exception) {
		console.log("SiteConfig Load Fail! path:" + SITE_CONFIG_FILE, exception);
	}
}

/**
 * 사이트 Config파일을 비동기형식으로 로드합니다.
 */
function readAsyncConfig (readCompleted) {
	try {
		const fs = require('fs');

		fs.readFile(SITE_CONFIG_FILE, (err, data) => {
			if (err) {
				console.log("siteConfig Async Read Fail!", err);
				throw err;
			} 
			global.SITE_CONFIG = JSON.parse(data);
			console.log("siteConfig read completed!", global.SITE_CONFIG)

			readCompleted();
		});
	} catch (exception) {
		console.log("SiteConfig Load Fail! path:" + SITE_CONFIG_FILE, exception);
	}
}
	
/**
 * 사이트 Config 정보를 파일에 씁니다.
 */
function writeConfig () {
	let data = JSON.stringify(global.SITE_CONFIG, null, 2);

	const fs = require('fs');
	fs.writeFileSync(SITE_CONFIG_FILE, data);
	console.log("siteConfig wirte completed!", global.SITE_CONFIG)
}

/**
 * 사이트 Config 정보를 비동기 형식으로 파일에 씁니다.
 */
function writeAsyncConfig () {
	let data = JSON.stringify(global.SITE_CONFIG, null, 2);

	fs.writeFile(SITE_CONFIG_FILE, data, (err) => {
		if (err) {
			console.log("siteConfig Async Write Fail!", err);
			throw err;
		} 

		console.log("siteConfig wirte completed!", global.SITE_CONFIG)
	});
}

module.exports = {
	readConfig: readConfig,
	readAsyncConfig: readAsyncConfig,
	writeConfig: writeConfig,
	writeAsyncConfig: writeAsyncConfig
};