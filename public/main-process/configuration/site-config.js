const logger = require('../../logger')
const fs = require('fs');
const { SITE_CONFIG_FILE } = require('../common/common-const');

/**
 * 사이트 Config파일을 로드합니다.
 */
function readConfig() {

	let configPath = require("path").join(global.ROOT_PATH, SITE_CONFIG_FILE);

	try {

		let rawdata = fs.readFileSync(configPath);
		global.SITE_CONFIG = JSON.parse(rawdata);
		logger.debug('site config read completed! %s\r\n %s', configPath,  global.SITE_CONFIG)

	} catch (exception) {
		logger.error("SiteConfig Load Fail! path:%s  %s", configPath, exception);
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
				logger.error("siteConfig Async Read Fail! %s", err);
				throw err;
			} 
			global.SITE_CONFIG = JSON.parse(data);
			
			logger.info("siteConfig wirte completed! %s", global.SITE_CONFIG)
			readCompleted();
		});
	} catch (ex) {
		logger.error("SiteConfig Load Fail! path: %s   %s", SITE_CONFIG_FILE, ex);
	}
}
	
/**
 * 사이트 Config 정보를 파일에 씁니다.
 */
function writeConfig () {
	let data = JSON.stringify(global.SITE_CONFIG, null, 2);

	const fs = require('fs');
	fs.writeFileSync(SITE_CONFIG_FILE, data);
}

/**
 * 사이트 Config 정보를 비동기 형식으로 파일에 씁니다.
 */
function writeAsyncConfig () {
	let data = JSON.stringify(global.SITE_CONFIG, null, 2);

	fs.writeFile(SITE_CONFIG_FILE, data, (err) => {
		if (err) {
			logger.error("siteConfig Async Write Fail! %s", err);
			throw err;
		} 

		logger.info("siteConfig wirte completed! %s", global.SITE_CONFIG)
	});
}

module.exports = {
	readConfig: readConfig,
	readAsyncConfig: readAsyncConfig,
	writeConfig: writeConfig,
	writeAsyncConfig: writeAsyncConfig
};