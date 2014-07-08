var CONN_REMOTE = 'Remote';
var CONN_LOCAL = 'Local';
var NETWORK_BTN_REMOTE_TITLE = "Remote Connection Enabled";
var NETWORK_BTN_LOCAL_TITLE = "Local Connection Enabled";

var currentNetworkType = Titanium.App.Properties.getString('currentNetworkType') || CONN_LOCAL;

function getConnectionInfo(){
    var connectionInfo = Titanium.App.Properties.getObject('conn_' + currentNetworkType) || {};
//    if (!connectionInfo){
//        //this is for backwards compatibility with the old way we used to store connections.
//        //We'll see if that exists since the connectionInfo didn't work the new way and we'll load them up
//        connectionInfo = {};
//        if(Titanium.App.Properties.getString('ipaddress')){
//            connectionInfo.ipaddress = Titanium.App.Properties.getString('ipaddress');
//            connectionInfo.method = Titanium.App.Properties.getString('http');
//            connectionInfo.port = Titanium.App.Properties.getString('port');
//            connectionInfo.username = Titanium.App.Properties.getString('username');
//            connectionInfo.password = Titanium.App.Properties.getString('password');
//        }
//    }
    $.changeNetworkBtn.title = (currentNetworkType == CONN_REMOTE) ? NETWORK_BTN_REMOTE_TITLE : NETWORK_BTN_LOCAL_TITLE;;
    $.server.value = connectionInfo.server || '';
    $.method.value = connectionInfo.method || '';
    $.port.value = connectionInfo.port || '';
    $.username.value = connectionInfo.username || '';
    $.password.value = connectionInfo.password || '';
}


function saveConnectionInfo(){
    //todo: validate form
    data = {
        'server' : $.server.value || '',
        'method' :$.method.value || 'http',
        'port' : $.port.value || '80',
        'username' : $.username.value || '',
        'password' : $.password.value || ''
    };
    Ti.API.info("conn_info: " + JSON.stringify(data));
    Ti.App.Properties.setObject('conn_' + currentNetworkType, data);
    Ti.App.Properties.setObject('conn_current', data);
    Ti.App.Properties.setString('currentNetworkType',currentNetworkType);
    device.init();  //renews the connection information
}


//LISTENERS
$.closeBtn.addEventListener('click', function () {
    saveConnectionInfo();
    Alloy.createController("index").getView().open();
    $.win.close();
});

$.clearData.addEventListener('click', function () {
    Ti.API.info("DATA CLEARED!");
    var deviceCol = Alloy.Collections.device;
    deviceCol.fetch();
    var model;

    while (model = deviceCol.first()) {
        model.destroy();
    }
    Alloy.Collections.device.reset();
    Ti.App.Properties.setObject('conn_' + CONN_REMOTE, {});
    Ti.App.Properties.setObject('conn_' + CONN_LOCAL, {});
    Ti.App.Properties.setObject('conn_current', {});
    $.server.value = '';
    $.method.value = '';
    $.port.value = '';
    $.username.value = '';
    $.password.value = '';
});

$.getListOfDevicesBtn.addEventListener('click', function () {
    saveConnectionInfo();
    Alloy.createController('settingsDeviceList').getView().open();
});

$.changeNetworkBtn.addEventListener('click', function(e) {
    saveConnectionInfo(); //save before we switch.
    //Toggle the network Type
    if(currentNetworkType == "Remote"){
        currentNetworkType = CONN_LOCAL;
        $.changeNetworkBtn.title = NETWORK_BTN_LOCAL_TITLE;
    }else{
        currentNetworkType = CONN_REMOTE;
        $.changeNetworkBtn.title = NETWORK_BTN_REMOTE_TITLE;
    }
    getConnectionInfo();
});


$.win.addEventListener("close", function(){
    $.destroy();
});
getConnectionInfo();
