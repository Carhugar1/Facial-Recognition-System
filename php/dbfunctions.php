<?php
    function getUIDFromNamespace($namespace) {
        return "$namespace";
    }
    
    function getFaceImgFromUID($uid) {
        if (FALSE) {
            /** Exists in Database already */

        } else {
            /** Retrieve it from BetaFace */
            require_once('betaface/api.php');
            $api = new betaFaceApi(new logger());
            $result = $api->get_face_info($uid);
            if ($result['face_image']) {
                /** ADD TO DB */


                return json_encode($result['face_image']);
            } else {
                return json_encode($result['xml']);
                //return "Error retrieving '$uid' from betaface";
            }
        }
    }
    
    function setPersonID($uid, $personID) {
        require_once('betaface/api.php');
        $api = new betaFaceApi(new logger());
        $result = $api->set_person_id($uid, $personID);
        return $result['success'];
    }
?>

