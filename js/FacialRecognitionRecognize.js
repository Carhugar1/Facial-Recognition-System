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
                    if (data && data.length) {
                        for (var i = 0; i < data.length; i++) {
                            var dataEntry = data[i];
                            if (dataEntry.results) {
                                // got results back!
                                generateThumbnails(dataEntry.results);
                            } else {
                                log('Error: no faces found!<br/>');
                            }

                            if (dataEntry.log) {
                                log(dataEntry.log);
                            }
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

        var i = 0;
        var tr;
        for (var uid in uids) {
            // append new row every 5 faces
            if ((i % 5) == 0) {
                table.append(tr = $("<tr></tr>"));
            }
            i++;

            td = $('<td></td>');
            tr.append(td); //table data

            var matches = uids[uid].matches;
            makeThumbnail(uid, matches, (function (td) {
                return function (thumbHTML) {
                    td.append(thumbHTML);
                }
            })(td));
        }
    }

    function makeThumbnail(uid, matches, callback) {
        $.ajax({
            type: 'POST',
            url: 'php/dbhandler.php',  //Server script to process data
            dataType: 'json',
            data: { functionname: 'getFaceImgFromUID', uid: uid },

            success: function (data) {
                if (!('error' in data)) {
                    var faceThumbnail = 'data:image/jpeg;base64,' + $.parseJSON(data.img)[0];
                    var text = computeText(matches);

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
                                .append($('<textarea></textarea>', {
                                    rows: "5",
                                    width: "196",
                                    id: "log-" + uid,
                                    readonly: "",
                                    tabindex: -1
                                })
                                    .css('background-color', 'rgba(200, 200, 200, 100)')
                                    .css('font-style', 'italic')
                                    .text(text)
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

    function computeText(matches) {
        var results = [];
        for (var personName in matches) {
            var conf = parseFloat(matches[personName]);
            var name = personName.substring(0, personName.search(/[0-9]/));

            if (results[name] === undefined) {
                results[name] = [];
                results[name]['conf'] = conf;
                results[name]['count'] = 1;
            } else {
                results[name]['conf'] += conf;
                results[name]['count'] += 1;
            }
        }

        var ret = "";
        var vals = [];
        for (var name in results) {
            vals.push({ name: name, conf: results[name]['conf'] / results[name]['count'] });
        }
        vals.sort(function (a, b) {
            return b.conf - a.conf;
        });

        for (var i = 0; i < vals.length; i++) {
            ret += vals[i].name + ' => ' + ('' + vals[i].conf).substring(0, 5) + '\n';
        }

        return ret;
    }

    $('#namespace').keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
        }
    });

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