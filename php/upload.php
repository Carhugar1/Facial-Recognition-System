<?php
	require_once('betaface/api.php');

    //
    
    $uploadpath = '../uploads/';
    if (!is_dir($uploadpath)) {
        mkdir($uploadpath);
    }
    
    $numimgs = count($_FILES['file']['name']);
    for ($i=0; $i < $numimgs; $i++) {
        $target = $uploadpath . $_FILES['file']['name'][$i];
        if (move_uploaded_file($_FILES['file']['tmp_name'][$i], $target)) {
            echo '[successfully uploaded ' . $target . ']<br/>';	  

			echo '<br/>Starting betaface analysis...<br/>';
			$api = new betaFaceApi();
			$api->log_level = 2;

			$exif_data = exif_read_data($target);
			$datetime=$exif_data['DateTimeOriginal'];


			$dateStr = date("c", strtotime($datetime));
			$personID = "image_".$dateStr . "@a-slice.net_001";
			$upload_response = $api->upload_face($target, $personID);

			echo "Upload complete for '$personID'<pre>";
			print_r($upload_response);
			echo "</pre>";
        } else {
            echo '[failed to upload' . $target . '...]<br/>';   
        }
    }
?>

