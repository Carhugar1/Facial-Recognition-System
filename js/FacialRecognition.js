/// <reference path="jquery-2.1.0.js" />
/// <reference path="jquery-2.1.0-vsdoc.js" />

$(function () {
    function log(msg) {
        $('#content').append(msg + "<br/>");
    }

    function doTraining(formData) {
        if (window.FormData) {
            var formData = new FormData(formData);
            $('body').spin("modal");
                                       
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
                success: function (data) {
                    $('body').spin("modal");
                                       
                    data = $.parseJSON(data);
                    if (data) {
                        if (data.uids) {
                            // got UIDs back!
                            generateThumbnails(data.uids);
                        } else {
                            log('Error: no faces found!<br/>');
                        }

                        if (data.log) {
                            log(data.log);
                        }
                    }
                },
                error: function (error) {  $('body').spin("modal");
                                       glob = error; log('Error: ' + error); },
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });

        }
    }

    function generateThumbnails(uids) {
        if (!uids) {
            return;
        }

        var thumbs = $('#thumbnails');
        for (var i = 0; i < uids.length; i++) {
            var uid = uids[i];
            makeThumbnail(uid, thumbs);
        }
    }

    function makeThumbnail(uid, thumbs) {
        $.ajax({
            type: 'POST',
            url: 'php/dbhandler.php',  //Server script to process data
            dataType: 'json',
            data: { functionname: 'getFaceImgFromUID', uid: uid },

            success: function (data) {
                if (!('error' in data)) {
                    var faceThumbnail = 'data:image/jpeg;base64,' + $.parseJSON(data.img)[0];
                    var html = $('<div></div>')
                                .attr('id', uid)
                                .append($('<img></img>', {
                                    //width: "200",
                                    // height: "200",
                                    src: faceThumbnail
                                })
                                )
                                .append('<br/>')
                                .append($('<input></input>', {
                                    type: "text",
                                    width: "116",
                                    id: 'name-' + uid
                                })
                                )
                                .append($('<input></input>', {
                                    type: "button",
                                    width: "80",
                                    value: "Set Name",
                                    id: "setname-" + uid
                                })
                                .data('uid', uid)
                                .click(function () {
                                    var uid = $(this).data('uid');
                                    var personID = $('#name-' + uid).val();
                                    if (personID && /[a-zA-Z ]@[a-zA-Z\.]/.test(personID)) {
                                        $('body').spin("modal");
                                        $.ajax({
                                            type: "POST",
                                            url: 'php/dbhandler.php',
                                            dataType: 'json',
                                            data: { functionname: 'setPersonID', uid: uid, personID: personID },

                                            success: function (obj, textstatus) {
                                                $('body').spin("modal");
                                                if (!('error' in obj)) {
                                                    console.log(obj);
                                                    alert('success');
                                                }
                                                else {
                                                    console.log(obj.error);
                                                }

                                            },

                                            error: function (error) {
                                                $('body').spin("modal");
                                                console.log('Error: ' + error);
                                            }
                                        });
                                    } else {
                                        var msg = 'Error: "' + personID + '" is not a valid person ID';
                                        log(msg);
                                        alert(msg);
                                    }
                                })
                                );
                    thumbs.append(html);
                    thumbs.append('<br/>');
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (error) { glob = error; log('Error: ' + error); }
        });
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

            error: function (error) {
                console.log('Error: ' + error);
            }
        });
    });
});