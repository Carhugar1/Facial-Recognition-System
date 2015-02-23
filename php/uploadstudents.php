<?php
    
    $uploadpath = '../uploads/students';
    if (!is_dir($uploadpath)) {
        mkdir($uploadpath);
    }
    
    $db = new PDO('mysql:host=a-slice.net;dbname=SE329Proj2;charset=utf8', 'root', 'potato44');
    $stmt = $db->query("SELECT id FROM Students");

    if(!stmt)
    {
       $sql = "CREATE TABLE Students ( 
       id INT() UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       studentid VARCHAR(9) NOT NULL,
       referencepath VARCHAR(100) NOT NULL)";

       $db->exec($sql);
       echo "Table Students created Successfully");
    }

    $numimgs = count($_FILES['file']['name']);
    for ($i=0; $i < $numimgs; $i++) {
        $target = $uploadpath . $_FILES['file']['name'][$i];
        if (move_uploaded_file($_FILES['file']['tmp_name'][$i], $target)) {
            
            $db->exec("INSERT INTO Students (studentid, referencepath)
            VALUES ($_FILES['file']['name'][$i], $target)");
            
            echo '[successfully uploaded ' . $target . ']<br/>';	  
        } else {
            echo '[failed to upload' . $target . '...]<br/>';   
        }
    }

    $db = null;
?>