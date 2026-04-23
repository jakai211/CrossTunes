# CrossTunes Login Logs

This folder contains login activity logs for your CrossTunes application.

## 📁 Structure
```
logs/
├── backend/          # Node.js backend logs
│   ├── login.log    # Login attempts (successful and failed)
│   └── error.log    # Backend errors
└── website/          # PHP website logs
    ├── login.log    # Login attempts (successful and failed)
    └── error.log    # PHP errors
```

## 📋 Log Format
All logs are in JSON format with the following fields:
- `timestamp`: ISO 8601 timestamp
- `event`: Event type (login, error)
- `email`: User email address
- `name`: Full name (for successful logins)
- `userId`: User ID (backend only)
- `success`: true/false for login attempts
- `ip`: IP address of the user
- `level`: error level (for error logs)
- `message`: Error message (for error logs)

## 🔍 Viewing Logs

### Quick View (Last 10 entries)
```bash
# Backend login logs
tail -10 logs/backend/login.log

# Website login logs
tail -10 logs/website/login.log
```

### Search for specific user
```bash
# Find all logins for a specific email
grep "user@example.com" logs/backend/login.log logs/website/login.log
```

### View successful logins only
```bash
# Backend successful logins
grep '"success":true' logs/backend/login.log

# Website successful logins
grep '"success":true' logs/website/login.log
```

### View by date
```bash
# Today's logins
grep "$(date +%Y-%m-%d)" logs/backend/login.log
```

## 📊 Log Analysis Examples

### Count total logins
```bash
wc -l logs/backend/login.log logs/website/login.log
```

### Most recent activity
```bash
# Last 5 login events across all systems
tail -5 logs/backend/login.log logs/website/login.log | sort
```

## 🔒 Security Notes
- Logs contain sensitive user information
- Consider log rotation for production
- Monitor for suspicious login patterns
- IP addresses are logged for security analysis