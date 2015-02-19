<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>PHP test</title>
        <link rel="stylesheet" href="../css/phppage.css">
    </head>
    <body>
        <b>Querying Database...</b>
        <br />
        <br />
        <div class="content">
            <?php
               // try {
                    $db = new PDO('mysql:host=a-slice.net;dbname=SE329Proj2;charset=utf8', 'root', 'potato44');
                    $stmt = $db->query("SELECT * FROM faces");
                    $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    require_once 'Console/Table.php';
                
                    $tbl = new Console_Table(CONSOLE_TABLE_ALIGN_CENTER, CONSOLE_TABLE_BORDER_ASCII, 1);
                
                    $tbl->setHeaders(array('Name', 'Age', 'Attendance'));
                
                    foreach ($arr as $entry) {
                        $tbl->addRow(array($entry['Name'], 
                                           $entry['Age'], 
                                           sprintf("%01.2f", $entry['Attendance'])));
                    }
                
                    echo '<b>Database results:</b><br/><br/>';
                    $result = $tbl->getTable();
                    $result = str_replace("\n", "<br/>", $result);
                    $result = str_replace(" ", "&nbsp;", $result);
                    echo $result;
                //} catch (PDOException $ex) {
               //     echo "An Error occured!"; //User friendly message/message you want to show to user
               //     echo $ex->getMessage();
               // }
            ?>
        </div>
    </body>
</html>
