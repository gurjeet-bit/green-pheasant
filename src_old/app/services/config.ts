
// var MAIN_URL    = 'https://dev.indiit.solutions/greenPheasantBackend/api/'; //edit your public ip
// var MAIN_LINK   = 'https://dev.indiit.solutions/greenPheasantBackend/public/assets/image'; //edit your public ip
// var Default_IMG = 'https://dev.indiit.solutions/greenPheasantBackend/public/assets/image/default.jpg'; //edit your public ip


var MAIN_URL    = 'https://www.greenpheasants.com/adminGreen/api/'; //edit your public ip
var MAIN_LINK   = 'https://www.greenpheasants.com/adminGreen/public/assets/image'; //edit your public ip
var Default_IMG = 'https://www.greenpheasants.com/adminGreen/public/assets/image/default.jpg'; //edit your public ip


// var MAIN_URL    = 'http://localhost/greenPheasantBackend/api/'; //edit your public ip
// var MAIN_LINK   = 'http://localhost/greenPheasantBackend/public/assets/image'; //edit your public ip
// var Default_IMG = 'http://localhost/greenPheasantBackend/public/assets/image/default.jpg'; //edit your public ip

export const config = {
	baseFrontAudios: 'http://localhost/realLifeHeroineBackend/public/assets/audio/',
  	API_URL : MAIN_URL,
	ENC_SALT: 'gd58_N9!ysS',
	errors: ['',null,undefined],
  	IMAGES_URL: MAIN_LINK,
  	DEFAULT_IMAGES_URL: Default_IMG,
  	MAIN_LINK: MAIN_LINK,
  	IMAGE_EXTENSIONS: ['image/png','image/jpg','image/jpeg','image/gif','image/bmp','image/webp']
};

export const social_config = {
  	FACEBOOK_ID: ''
};

/* export const socket_config = {
    SOCKET_URL: MAIN_URL+SOCKET_URL_PORT,
};
 */
