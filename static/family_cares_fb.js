var FC = new FamilyCares();

var FC_family_cares = "Family Cares - ";

function FamilyCares() {
}

FamilyCares.prototype.request_groups = function(callback) {
    if (!callback) {
        console.log('FamilyCares request_groups() No callback specified');
        return null;
    }
    FB.api('/me/groups', function(response) {
        var groups = [];
        if (!('data' in response)) {
            console.log("FamilyCares /me/groups failed ["+response+"]");
            return null;
        }
        for (var i=0; i < response['data'].length; ++i) {
            var entry = response['data'][i];
            /* Matches must be at the begining of the string */
            if (entry['name'].indexOf(FC_family_cares) == 0) {
                var group_name = entry['name'].substr(FC_family_cares.length, (entry['name'].length - FC_family_cares.length));
                entry['name'] = group_name;
                groups.push(entry);
            }
        }
        if (groups.length == 0) {
            console.log("No familycares groups found, probably a permission issue.  Especially if there is nothing in the data section. ["+JSON.stringify(response)+"]");
        }
        callback(groups);
    });
}

FamilyCares.prototype.request_group_members = function(groupId, callback) {
    var path='/'+groupId+'/members';
    FB.api(path, function(response) {
        if (!('data' in response)) {
            console.log("FamilyCares group_members() "+path+" failed ["+JSON.stringify(response)+"]");
            return null;
        }
       
        var members = []
        for (var i=0; i < response['data'].length; ++i) {
            members.push(response['data'][i]);
        }

        if (callback) {
            callback(members);
        }
    });
}

FamilyCares.prototype.request_member_picture = function(memberId, callback) {
    var path = '/'+memberId+'?fields=picture&type=normal';
    FB.api(path, function(response) {
        if (!('picture' in response)) {
            console.log("FamilyCares "+path+" failed ["+JSON.stringify(response)+"]");
            return null;
        }

        var pictureUrl = ""
        if ('picture' in response) {
            pictureUrl = response['picture'];
        } else {
            console.log("No picture");
        }

        if (callback) {
            callback(pictureUrl);
        }
    });
}
/*
FamilyCares.prototype. = function() {

}
*/
