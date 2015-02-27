<?php
    require_once("dbfunctions.php");
    
    header('Content-Type: application/json');
    
    $aResult = array();
    
    if (!isset($_POST['functionname'])) { $aResult['error'] = 'No function name!'; }
    
    if (!isset($aResult['error'])) {
        switch ($_POST['functionname']) {
        case 'getUIDFromNamespace':
            if (!isset($_POST['namespace'])) {
                $aResult['error'] = 'Error: Missing namespace.';
            }
            else {
                $aResult['result'] = getUIDFromNamespace($_POST['namespace']);
            }
            break;
    
        case 'getFaceImgFromUID':
            if (!isset($_POST['uid'])) {
                $aResult['error'] = 'Error: missing uid.';
            }
            else {
                $aResult['img'] = getFaceImgFromUID($_POST['uid']);
            }
            break;
    
        case 'setPersonID':
            if (!isset($_POST['uid'])) {
                $aResult['error'] = 'Error: missing uid.';
            } else if (!isset($_POST['personID'])) {
                $aResult['error'] = 'Error: missing person id.';
            } else {
                $aResult['result'] = setPersonID($_POST['uid'], $_POST['personID']);
            }
            break;
    
        default:
            $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
            break;
        }
    }
    
    echo json_encode($aResult);
?>

