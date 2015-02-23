<?php
    
    $uploadpath = '../uploads/attendance';
    if (!is_dir($uploadpath)) {
        mkdir($uploadpath);
    }
    
    $db = new PDO('mysql:host=a-slice.net;dbname=SE329Proj2;charset=utf8', 'root', 'potato44');
    $stmt = $db->query("SELECT id FROM Attendance");

    if(!stmt)
    {
       $sql = "CREATE TABLE Attendance ( 
       id INT() UNSIGNED AUTO_INCREMENT PRIMARY KEY,
       date DATE NOT NULL,
       referencepath VARCHAR(100) NOT NULL)";

       $db->exec($sql);
       echo "Table Students created Successfully");
    }

    $numimgs = count($_FILES['file']['name']);
    for ($i=0; $i < $numimgs; $i++) {
        $target = $uploadpath . $_FILES['file']['name'][$i];
        if (move_uploaded_file($_FILES['file']['tmp_name'][$i], $target)) {
            
            $db->exec("INSERT INTO Students (date, referencepath)
            VALUES (date("Y-m-d", $target)");
            
            echo '[successfully uploaded ' . $target . ']<br/>';	  
        } else {
            echo '[failed to upload' . $target . '...]<br/>';   
        }
    }

    $db = null;
?>