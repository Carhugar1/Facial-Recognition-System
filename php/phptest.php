<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>PHP test</title>
        <link rel="stylesheet" href="../css/mainpage.css">
    </head>
    <body>
        Hola
        <br />
        <div class="content">
            <?php
                try {
                    $db = new PDO('mysql:host=localhost;dbname=SE329Proj2;charset=utf8', 'root', 'potato44');
                    $stmt = $db->query("SELECT * FROM faces");
                    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    print_r($arr);
                } catch (PDOException $ex) {
                    echo "An Error occured!"; //User friendly message/message you want to show to user
                    echo $ex->getMessage();
                }
            ?>
        </div>
        Adios
    </body>
</html>
