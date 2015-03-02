/// <reference path="jquery-2.1.0.js" />
/// <reference path="jquery-2.1.0-vsdoc.js" />

$(function () {
    $('#getImages').click(function () {
        var namespace = $('#namespace').val();
        $.ajax({
            type: "POST",
            url: 'php/dbhandler.php',
            dataType: 'json',
            data: { functionname: 'getUIDFromNamespace', namespace: namespace },

            success: function (obj, textstatus) {
                if (!('error' in obj)) {
                    $('#imgs').text(obj.result);
                }
                else {
                    console.log(obj.error);
                }
            },

            error: function (error) {
                console.log('Error: ' + error);
            }
        });
    });
});