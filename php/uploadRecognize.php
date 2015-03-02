<?php
    require_once('betaface/api.php');
    require_once('dbfunctions.php');

    //
    
    $uploadpath = '../uploads/';
    if (!is_dir($uploadpath)) {
        mkdir($uploadpath);
    }
    
    $namespace = $_POST['namespace'];
    $numimgs = count($_FILES['file']['name']);
    for ($i=0; $i < $numimgs; $i++) {
        $log = new logger();
        $target = $uploadpath . $_FILES['file']['name'][$i];
        if (move_uploaded_file($_FILES['file']['tmp_name'][$i], $target)) {
            $log->log('[successfully uploaded ' . $target . ']<br/>');	  

			$log->log('<br/>Starting betaface analysis...<br/>');
			$api = new betaFaceApi($log);
			$api->log_level = 2;

			$result = $api->recognize_faces_multiple($target, $namespace);            
            $resultArr[$i] = array("results" => $result, "log" => $log->get_log());
        } else {
            $log->log('[failed to upload' . $target . '...]<br/>');   
            $resultArr[$i] = array("results" => array(), "log" => $log->get_log());
        }
    }

    echo json_encode($resultArr);
?>

