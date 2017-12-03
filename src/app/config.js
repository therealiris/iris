// static config variables
// import { Component } from '@angular/core';
// @Component({})
var Config = /** @class */ (function () {
    function Config() {
    }
    // url of the chat server
    // for local development it will be something like http://192.168.0.214:9000/
    //public static server = 'https://ionic-video-chat-server.herokuapp.com/';
    Config.server = 'ws://139.162.5.76:5000/';
    // enables or disables chat sounds. usefull for development
    Config.audio = true;
    // STUN/TURN ice servers for connection negotiation
    Config.ice = [
        {
            urls: 'stun:stun.l.google.com:19302'
        }, {
            urls: 'stun:stun.services.mozilla.com'
        }, {
            urls: 'stun:numb.viagenie.ca',
            username: 'sidharth016@gmail.com',
            credential: 'noThing@123'
        }, {
            urls: 'turn:numb.viagenie.ca',
            username: 'sidharth016@gmail.com',
            credential: 'noThing@123'
        }
    ];
    // if we allow attachments or not.
    // be sure to configure your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and S3_BUCKET in the server config
    Config.attachments = true;
    // whether or enable markdown parsing client side
    Config.markdown = true;
    return Config;
}());
export { Config };
//# sourceMappingURL=config.js.map