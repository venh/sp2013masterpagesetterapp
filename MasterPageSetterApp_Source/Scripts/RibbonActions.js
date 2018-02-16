var hostweburl;
var appweburl;
var itemID;
var listID;
var item;
var file;
var dfd;
var fileUrl;
var waitDialog;

function getFile() {
    hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
    itemID = decodeURIComponent(getQueryStringParameter('SelectedItemID'));
    listID = decodeURIComponent(getQueryStringParameter('SelectedListID'));
    listID = listID.replace(/{/g, '').replace(/}/g, '');
    if ((listID != 'undefined') && (itemID != 'undefined')) {
        var resp = confirm("Are you sure?");
        if (resp) {
            ShowWaitDialog();
        }
        else {
            closeParentDialog(true);
        }
        var reqUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists(guid'" + listID + "')/items(" + itemID + ")/File?@target='" + hostweburl + "'";
        $.ajax({
            headers: { "Accept": "application/json;odata=verbose" },
            contentType: 'application/json',
            url: reqUrl,
            success: successHandler,
            error: errorHandler
        });
    }
}

function successHandler(data) {
    var fileName = data.d.Name;
    fileUrl = data.d.ServerRelativeUrl;
    var fileNameParts = fileName.split('.');
    var fileExtn;
    if (fileNameParts.length === 1 || (fileNameParts[0] === "" && fileNameParts.length === 2)) {
        waitDialog.close();
        alert('Issues in File Name');
        closeParentDialog(true);
    }
    else {
        fileExtn = fileNameParts.pop();
    }
    if (fileExtn != "" && fileExtn != "master") {
        waitDialog.close();
        alert('This will work only for master pages.');
        closeParentDialog(true);
        return false;
    }
    else {      
            var reqUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/masterUrl?@target='" + hostweburl + "'";
            $.ajax({
                headers: { "Accept": "application/json;odata=verbose" },
                contentType: 'application/json',
                url: reqUrl,
                success: getMasterSuccessHandler,
                error: errorHandler
            });
    }
}

function getMasterSuccessHandler(data) {
    var currMasterUrl = data.d.MasterUrl;   
    if (fileUrl == currMasterUrl) { waitDialog.close(); alert("The file at '" + fileUrl + "' is the current default master page. So please select another master page."); closeParentDialog(true); return false; }
    else {
        var reqUrl = appweburl + "/_api/SP.AppContextSite(@target)/web?@target='" + hostweburl + "'";
        $.ajax({
            url: reqUrl,
            type: "POST",
            data: JSON.stringify({ '__metadata': { 'type': 'SP.Web' }, 'MasterUrl': fileUrl, 'CustomMasterUrl': fileUrl }),
            headers: {
                "X-HTTP-Method": "MERGE",
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*"
            },
            success: setMasterSuccessHandler,
            error: errorHandler
        });
    }
}

function setMasterSuccessHandler(data) {
    waitDialog.close();
    alert("Master Page Changed Successully. Please press CTRL+F5 for changes to reflect.");
    closeParentDialog(false);
}

function errorHandler(err) {
    waitDialog.close();
    alert('Request failed. ' + err.responseText);
    closeParentDialog(true);
}

function getQueryStringParameter(param) {
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == param) {
            return singleParam[1];
        }
    }
}
function closeParentDialog(refresh) {
    var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
    if (refresh) 
        target.postMessage('CloseCustomActionDialogRefresh', '*');    
    else
        target.postMessage('CloseCustomActionDialogNoRefresh', '*');
}
function ShowWaitDialog() {
    waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while request is in progress...', 300, 300);
}