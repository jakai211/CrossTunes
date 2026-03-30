<style>
  /* Inline overrides so the card works even without ih_styles.css */
</style>
<?php
if (!isset($_SESSION['login'])) {
?>
<div class="login-card">
  <div class="logo-area">
    <div class="logo-icon">CT</div>
    <span class="logo-name">CrossTune</span>
  </div>
  <h2>Log In to Your Account</h2>
  <form name="login" action="index.php" method="post">
    <label for="email_address">Email Address</label>
    <input type="text" id="email_address" name="email_address" size="20">
 
    <label for="password">Password</label>
    <input type="password" id="password" name="password" size="20">
 
    <div class="mfa-notice">
      <input type="checkbox" checked disabled>
      <span>Authentication via Email Verification or MFA is required upon login attempt for enhanced security</span>
    </div>
 
    <input type="submit" value="Log In">
    <input type="hidden" name="content" value="validate">
  </form>
  <div class="login-links">
    <a href="#">Forgot Password?</a><br><br>
    Don't have an account? <a href="#">Sign Up</a>
  </div>
</div>
<?php
} else {
  $safeName = htmlspecialchars($_SESSION['login'], ENT_QUOTES, 'UTF-8');
?>
<div class="login-card">
  <div class="logo-area">
    <div class="logo-icon">CT</div>
    <span class="logo-name">CrossTune</span>
  </div>
  <div class="welcome-box">
    <h2>Welcome, <?php echo $safeName; ?>!</h2>
    <p>This program tracks category and item inventory.</p>
    <p>Please use the links in the navigation window.</p>
    <p>Please DO NOT use the browser navigation buttons!</p>
    <a href="index.php?content=logout">Logout</a>
  </div>
</div>
<?php
}
?>
 