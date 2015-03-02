/// <reference path="jquery-2.1.0.js" />
/// <reference path="jquery-2.1.0-vsdoc.js" />

$(function () {
    function log(msg) {
        $('#content').append(msg + "<br/>");
    }

    function doRecognize(data) {
        if (window.FormData) {
            var formData = new FormData(data);
            formData.append('namespace', $('#namespace').val())
            $('body').spin("modal");

            $.ajax({
                url: 'php/uploadRecognize.php',  //Server script to process data
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
                error: function (error) {
                    $('body').spin("modal");
                    glob = error; log('Error: ' + error);
                },
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

        table = $('<table></table>');
        thumbs.append(table); //table begin

        for (var i = 0; i < uids.length; i++) {
            var uid = uids[i];

            // append new row every 5 faces
            if ((i % 5) == 0) {
                table.append(tr = $("<tr></tr>"));
            }

            td = $('<td></td>');
            tr.append(td); //table data

            makeThumbnail(uid, (function (td) {
                return function (thumbHTML) {
                    td.append(thumbHTML);
                }
            })(td));
        }
    }

    function makeThumbnail(uid, callback) {
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
                                    width: "200",
                                    height: "280",
                                    src: faceThumbnail,
                                    id: 'img-' + uid
                                })
                                )
                                .append('<br/>')
                                .append($('<input></input>', {
                                    type: "text",
                                    width: "196",
                                    id: 'name-' + uid
                                })
                                    .keypress(function (e) {
                                        if (e.which == 13) {
                                            $('#setname-' + uid).click();
                                        }
                                    })
                                )
                                .append('<br/>')
                                .append($('<input></input>', {
                                    type: "button",
                                    width: "120",
                                    value: "Not a Face?",
                                    id: "notaface-" + uid,
                                    tabindex: -1
                                })
                                    .click(function () {
                                        if ($(this).attr('value') === 'Show Image') {
                                            $(this).attr('value', 'Not a Face?');
                                            $('#img-' + uid).show();
                                            $('#name-' + uid).show();
                                            $('#setname-' + uid).show();
                                            $('#log-' + uid).show();
                                        } else {
                                            $(this).attr('value', 'Show Image');
                                            $('#img-' + uid).hide();
                                            $('#name-' + uid).hide();
                                            $('#setname-' + uid).hide();
                                            $('#log-' + uid).hide();
                                        }
                                    })
                                    .css('margin-left', 'auto')
                                    .css('margin-right', 'auto')
                                )
                                .append($('<input></input>', {
                                    type: "button",
                                    width: "80",
                                    value: "Set Name",
                                    id: "setname-" + uid,
                                    tabindex: -1
                                })
                                    .data('uid', uid)
                                    .click(function () {
                                        var uid = $(this).data('uid');
                                        var personID = $('#name-' + uid).val();
                                        var personIDRegex = /^[a-zA-Z0-9_]+@[a-zA-Z0-9-_\.]+$/;
                                        var regexMatches = personIDRegex.test(personID);
                                        if (personID && regexMatches) {
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
                                                        if (obj.result.success) {
                                                            $('#log-' + uid).val('Name: ' + obj.result.personID);
                                                        }
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
                                            var msg = '<p>Error: "' + personID + '" is not a valid person ID. <br/><br/>' +
                                                        'Must match ' + personIDRegex + "</p>";
                                            log(msg);
                                            $('#dialogDiv')
                                            .html(msg)
                                            .dialog({
                                                modal: true,
                                                width: 500,
                                                buttons: {
                                                    Ok: function () {
                                                        $(this).dialog("close");
                                                    }
                                                }
                                            });
                                        }
                                    }
                                ))
                                .append('<br/>')
                                .append($('<input></input>', {
                                    type: "text",
                                    width: "196",
                                    id: "log-" + uid,
                                    readonly: "",
                                    tabindex: -1
                                })
                                    .css('background-color', 'rgba(180, 180, 180, 100)')
                                    .css('font-style', 'italic')
                                )
                                ;
                    callback(html);
                    // thumbs.append(html);
                    //   thumbs.append('<br/>');
                }
                else {
                    console.log(obj.error);
                }
            },
            error: function (error) { glob = error; log('Error: ' + error); }
        });
    }

    $('#fileUpload').click(function () {
        var namespace = $('#namespace').val();
        var namespaceRegex = /^[a-zA-Z0-9-_\.]+$/;
        if (!namespaceRegex.test(namespace)) {
            var msg = '<p>Error: "' + namespace + '" is not a valid namespace. <br/><br/>' +
                                                        'Must match ' + namespaceRegex + "</p>";
            $('#dialogDiv')
            .html(msg)
            .dialog({
                modal: true,
                width: 500,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
        } else if ($('#recognizeFile')[0].files.length == 0) {
            var msg = '<p>Error: must select a file to recognize.</p>';
            $('#dialogDiv')
            .html(msg)
            .dialog({
                modal: true,
                width: 500,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
        } else {
            log("");
            var l = $('#recognizeFile')[0].files.length;
            log("Uploading " + l + " image" + (l == 1 ? "" : "s") + " (" +
                    $.map($('#recognizeFile')[0].files, (function (file) { return file.name; })) + ")");
            doRecognize($('#recognizeForm')[0]);
        }
    });
});