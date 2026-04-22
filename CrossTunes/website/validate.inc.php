<?php
 require_once('database.php');
 $emailAddress = filter_input(INPUT_POST, 'email_address', FILTER_VALIDATE_EMAIL);
 $password = $_POST['password'] ?? '';
 if($emailAddress){
 $query = "SELECT first_name, last_name FROM guitar_users " .
        "WHERE email_address = ? AND password = SHA2(?,256)";
 $db = getDB();
 $stmt = $db->prepare($query);
 $stmt->bind_param("ss", $emailAddress, $password);
 $stmt->execute();
 $stmt->bind_result($firstName, $lastName);
 $fetched = $stmt->fetch();
 $stmt->close();
 $db->close();
 $name = "$firstName $lastName";
 if ($fetched && isset($name)) {
   session_regenerate_id(true);
   $_SESSION['login'] = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
   header("Location: index.php");
   exit;
 } else {
   echo "<h2>Sorry, login incorrect</h2>\n";
   echo "<a href=\"index.php\">Please try again</a>\n";
} } else{
  echo "<h2>Please log in with a valid email address.</h2>\n";
  echo '<a href="index.php">Please try again</a>';
}
?>
 