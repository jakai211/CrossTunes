<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
   <title>CrossTune</title>
   <link rel="stylesheet" type="text/css" href="ih_styles.css">
   <link rel="icon" type="image/png" href="images/logo.png">
</head>
<body>
   <header>
       <?php if (file_exists("header.inc.php")) include("header.inc.php"); ?>
   </header>
   <section>
       <nav>
           <?php if (file_exists("nav.inc.php")) include("nav.inc.php"); ?>
       </nav>
       <main>
           <?php
           $allowed_pages = ['main', 'validate', 'logout'];
           if (isset($_REQUEST['content']) && in_array($_REQUEST['content'], $allowed_pages, true)) {
               include($_REQUEST['content'] . ".inc.php");
           } else {
               include("main.inc.php");
           }
           ?>
       </main>
   </section>
   <footer>
       <?php if (file_exists("footer.inc.php")) include("footer.inc.php"); ?>
   </footer>
</body>
</html>