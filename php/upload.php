<?php
    //
    
    $uploadpath = '../uploads/';
    if (!is_dir($uploadpath)) {
        mkdir($uploadpath);
    }
    
    $numimgs = count($_FILES['file']['name']);
    for ($i=0; $i < $numimgs; $i++) {
        $target = $uploadpath . $_FILES['file']['name'][$i];
        if (move_uploaded_file($_FILES['file']['tmp_name'][$i], $target)) {
            echo '[success move ' . $target . ']<br/>';   
        } else {
            echo '[fail move ' . $target . ']<br/>';   
        }
    }
?>

