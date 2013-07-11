var reader = new FileReader();

function readUpload(reqFile, $textarea){
    if(reqFile.files && reqFile.files[0]){
        var reader = new FileReader();
        reader.onload = function (e) {
            $textarea.html(e.target.result);
        };  // End onload()
        reader.readAsText(reqFile.files[0]);
    }  // End if html5 filelist support
}
function sortKeys(obj) {
    var dictKeys = [];
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            dictKeys.push(key);
        }
    }
    var sortedArray = dictKeys.sort();
    sortedKeys = [];
    for (var k in sortedArray) {
        sortedKeys.push(sortedArray[k]);
    }
    return sortedKeys;
}
function demoRequirements() {
    // This populates the textarea and compares them.
    // TODO: add something to empty the text boxes out
    $('#file1').load('demo/requirements-v1.txt', function() {
        $('#file2').load('demo/requirements-v2.txt', function() {
            compare();
        });
    });
}
function compare() {
    var packageDict;
    var packageName, version, match, row;
    var lines1 = $('#file1').val().split('\n');
    var lines2 = $('#file2').val().split('\n');
    var $resultsTable = $('#results tbody');

    // Empty the reults table
    $('#results tr:not(.header)').remove();

    packageDict = {};
    for (i = 0; i < lines1.length; i++) {
        if (lines1[i].indexOf('#') > 0) {
            continue;
        }

        // Split the package into name and version
        line = lines1[i].split('==');
        packageName = line[0];
        if (line.length == 2){
            version = line[1];
        } else {
            version = 'Most Recent';
        }
        if (packageName) {
            packageDict[packageName] = [version, ''];
        }
    }
    for (i = 0; i < lines2.length; i++) {
        if (lines2[i].indexOf('#') > 0) {
            continue;
        }
        line = lines2[i].split('==');
        packageName = line[0];
        if (line.length == 2){
            version = line[1];
        } else {
            version = 'Most Recent';
        }

        // Check that it is a valid package name and whether it is in Req1 already
        if (packageName && packageName in packageDict) {
            packageDict[packageName][1] = version;
        } else if (packageName) {
            packageDict[packageName] = ['', version];
        }
    }

    sortedKeys = sortKeys(packageDict);
    for (var k in sortedKeys){
        row = $('<tr>');
        match = packageDict[sortedKeys[k]][0] == packageDict[sortedKeys[k]][1];
        if (match) {
            row.addClass('matchReq');
        } else {
            row.addClass('updateReq');
        }
        $('<td class="packageName">').text(sortedKeys[k]).appendTo(row);                // Package Name
        $('<td class="version1">').text(packageDict[sortedKeys[k]][0]).appendTo(row);   // Requirements 1
        $('<td class="version2">').text(packageDict[sortedKeys[k]][1]).appendTo(row);   // Requirements 2
        $('<td class="match">').text(match).appendTo(row);                              // Match

        row.appendTo($('#results tbody'));
        $('textarea').css('height', 200);
        $('#results .header').slideDown();
    }
}

$(document).ready(function() {
    $('#compare').click(function(){
        compare();
    });
    $('#demo').click(function() {
        demoRequirements();
    });
    $('input[type="file"]').change(function () {
        readUpload(this, $(this).siblings('textarea'));
    });
    $('button').click(function() {
        $(this).siblings('input').click();
    });

    // TODO: Check the latest version of each package to see if update needed
    // $('#pipList').load('https://pypi.python.org/pypi?%3Aaction=index .list');
});
