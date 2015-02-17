<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>PHP test</title>
    </head>
    <body>
        Hola
        <?php
            try {
                $db = new PDO('mysql:host=localhost;dbname=SE329Proj2;charset=utf8', 'root', 'potato44');
                echo $db
            } catch (PDOException $ex) {
                echo "An Error occured!"; //User friendly message/message you want to show to user
                echo $ex->getMessage();
            }
        ?>
    </body>
</html>
