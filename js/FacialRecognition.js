/// <reference path="jquery-2.1.0.js" />
/// <reference path="jquery-2.1.0-vsdoc.js" />

$(function () {
    function log(msg) {
        $('#content').append(msg + "<br/>");
    }

    function doTraining(formData) {
        if (window.FormData) {
            var formData = new FormData(formData);
            $.ajax({
                url: 'php/upload.php',  //Server script to process data
                type: 'POST',
                xhr: function () {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { // Check if upload property exists
                        myXhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                $('progress').attr({ value: e.loaded, max: e.total });
                            }
                        }, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                //Ajax events
                beforeSend: function () { },
                success: function (data) { log('Data: ' + data); },
                error: function (error) { glob = error; log('Error: ' + error); },
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });

        }
    }

    function retrieveMatch(img) {

    }

    $('#fileUpload').click(function () {
        log("");
        log("Uploading " + $('#trainingFiles')[0].files.length + " images (" +
                $.map($('#trainingFiles')[0].files, (function (file) { return file.name; })) + ")");
        doTraining($('form')[0]);
    });
    $('#recognizeBtn').change(function () {
        log("Uploading " + this.files.length + " images...");
        file = this.files[0];
    });

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

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

            error: function(error) {
                console.log('Error: ' + error);
            }
        });
    });
});