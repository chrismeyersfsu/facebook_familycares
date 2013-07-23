var FbState = new FbUtility();
function FbUtility() {
    this.userLoggedIn = false;
    this.accessToken = "";
    this.userId = "";
}

FbUtility.prototype.set_session = function(response) {
    this.userLoggedIn = true;
    this.accessToken = response['authResponse']['accessToken'];
    this.userId = response['authResponse']['userId'];

    console.log("set_session() access_token ["+this.accessToken+"] userId ["+this.userId+"]");
};

FbUtility.prototype.invalidate_session = function(response) {
    this.userLoggedIn = false;
    this.accessToken = "";
    this.userId = "";

    console.log("invalidate_session()");
};

/***************************************
 * Facebook LOGIN
 ***************************************/
function click_fb_login(event, permissions, callback) {
    return do_fb_login(permissions, callback);
}

function do_fb_login(permissions, callback) {
    FB.login(function(response) {
        if (callback) {
            return callback(response);
        } else {
            console.log("You didn't register a callback for this function, so we are going to do operations that you might have wanted to do");
            console.log("1. After logging you in we will issue a request to graph's /me and grab user info");
            console.log("2. If loging is success you will be notified of your current name");
            if (response.authResponse) {
                console.log("User logged in successfully, grabbing the loging info ...\n");
                FB.api('/me', function(response) {
                    console.log("User ["+response.name+"] is now logged in");
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
            return null;
        }
    }, { scope : permissions });
}

/***************************************
 * Facebook LOGOUT
 ***************************************/
function click_fb_logout(event, callback) {
    return do_fb_logout(callback);
}

function do_fb_logout(callback) {
    FB.logout(function(response) {
        if (callback) {
            return callback(response);
        } else {
            console.log("You didn't register a logout callback");
            return null;
        }
    });
    return null;
}

/***************************************
 * Facebook SESSION LISTENERS
 * Used to maintain a 'cached' global state
 ***************************************/
function fb_register_session() {
    fb_subscribe_login();
    fb_subscribe_logout();
}

function fb_subscribe_login(callback) {
    FB.Event.subscribe('auth.login', function(response) {
        if (response.status == 'connected') {
            FbState.set_session(response);
        } else {
            FbState.invalidate_session(response);
        }

        if (callback) {
            callback(response);
        } else {
            console.log("No callback for registered login listener");
        }
    });
}

function fb_subscribe_logout(callback) {
    FB.Event.subscribe('auth.logout', function(response) {
        if (response.status == '') {
            FbState.invalidate_session(response);
        } else {
            // Invalidate the session no matter what
            FbState.invalidate_session(response);
        }

        if (callback) {
            callback(response);
        } else {
            console.log("No callback for registered login listener");
        }
    });
}

