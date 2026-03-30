<?php
 function getDB($echo_mode = false) {
   $host = getenv('DB_HOST') ?: 'localhost';
   $port = (int)(getenv('DB_PORT') ?: 3306);
   $dbname = getenv('DB_NAME') ?: 'guitar';
   $username = getenv('DB_USER') ?: 'ih_user';
   $password = getenv('DB_PASS') ?: '';
   mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
   try {
       $db = new mysqli($host, $username, $password, $dbname, $port);
       error_log("Database connection successful to " . $host);
       if ($echo_mode) echo "Database connection successful to " . $host;
       return $db;
   } catch (mysqli_sql_exception $e) {
       error_log("Database connection failed: " . $e->getMessage());
       if ($echo_mode) echo "Database connection failed.";
   }
 }
 //getDB(true);
?>