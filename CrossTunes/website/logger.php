<?php
function logLogin($email, $name, $success = true) {
    $logDir = __DIR__ . '/../../logs/website/';
    $logFile = $logDir . 'login.log';

    $logEntry = [
        'timestamp' => date('c'), // ISO 8601 format
        'event' => 'login',
        'email' => $email,
        'name' => $name,
        'success' => $success,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];

    $logLine = json_encode($logEntry) . PHP_EOL;

    // Create directory if it doesn't exist
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

function logError($message, $error = null) {
    $logDir = __DIR__ . '/../../logs/website/';
    $logFile = $logDir . 'error.log';

    $logEntry = [
        'timestamp' => date('c'),
        'level' => 'error',
        'message' => $message,
        'error' => $error,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];

    $logLine = json_encode($logEntry) . PHP_EOL;

    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}
?>