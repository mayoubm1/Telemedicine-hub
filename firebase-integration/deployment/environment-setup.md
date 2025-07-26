# Environment Setup for Telemedicine Hub

This document provides detailed instructions for setting up the environment variables and configurations required for the Telemedicine Hub Firebase deployment.

## Required Environment Variables

### 1. OpenAI Configuration
The AI functionality requires OpenAI API access:

```bash
# Set OpenAI API key in Firebase Functions config
firebase functions:config:set openai.api_key="your-openai-api-key-here"
firebase functions:config:set openai.api_base="https://api.openai.com/v1"
```

### 2. Application Configuration
```bash
# Set application environment
firebase functions:config:set app.environment="production"
firebase functions:config:set app.cors_origin="https://your-firebase-domain.web.app"
```

### 3. Security Configuration
```bash
# JWT secret for token signing
firebase functions:config:set security.jwt_secret="your-super-secure-jwt-secret-here"

# Rate limiting configuration
firebase functions:config:set security.rate_limit_window="15"
firebase functions:config:set security.rate_limit_max="100"
```

### 4. Database Configuration
```bash
# MongoDB connection (if using external MongoDB)
firebase functions:config:set database.mongodb_uri="your-mongodb-connection-string"

# Or use Firestore (recommended for Firebase)
firebase functions:config:set database.type="firestore"
```

### 5. Email Configuration (Optional)
```bash
# For sending notifications and alerts
firebase functions:config:set email.service="sendgrid"
firebase functions:config:set email.api_key="your-sendgrid-api-key"
firebase functions:config:set email.from_address="noreply@your-domain.com"
```

### 6. Video Calling Configuration
```bash
# Jitsi Meet configuration
firebase functions:config:set video.jitsi_domain="meet.jit.si"
firebase functions:config:set video.jitsi_app_id="your-jitsi-app-id"
```

## Firebase Project Setup

### 1. Enable Required APIs
```bash
# Enable required Google Cloud APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
```

### 2. Configure Authentication
```bash
# Enable authentication providers in Firebase Console
# - Email/Password
# - Google Sign-In
# - Phone Authentication (optional)
```

### 3. Set up Firestore Database
```bash
# Initialize Firestore in your Firebase project
firebase firestore:delete --all-collections  # Only if starting fresh
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 4. Configure Storage Rules
```bash
# Deploy storage security rules
firebase deploy --only storage
```

## Local Development Setup

### 1. Install Dependencies
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Install project dependencies
cd functions
npm install
```

### 2. Set up Local Environment
```bash
# Create local environment file for development
cd functions
cat > .env << EOF
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-local-jwt-secret
EOF
```

### 3. Start Firebase Emulators
```bash
# Start local Firebase emulators
firebase emulators:start
```

### 4. Test Local Setup
```bash
# Test functions locally
curl http://localhost:5001/your-project-id/us-central1/api/health

# Test authentication
curl -X POST http://localhost:5001/your-project-id/us-central1/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'
```

## Production Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Frontend applications built and tested
- [ ] Firebase project created and configured
- [ ] Required APIs enabled
- [ ] Security rules reviewed and tested
- [ ] Database schema validated

### Deployment
- [ ] Run deployment script: `./deployment/deploy.sh`
- [ ] Verify functions deployment
- [ ] Test hosting deployment
- [ ] Validate database rules
- [ ] Test authentication flow

### Post-deployment
- [ ] Configure custom domain (if needed)
- [ ] Set up monitoring and alerts
- [ ] Test all critical features
- [ ] Configure backup procedures
- [ ] Set up analytics tracking

## Security Considerations

### 1. API Keys Management
- Store all API keys in Firebase Functions config
- Never commit API keys to version control
- Rotate API keys regularly
- Use different keys for development and production

### 2. Database Security
- Review and test Firestore security rules
- Implement proper user authentication
- Use field-level security where needed
- Regular security audits

### 3. CORS Configuration
- Configure CORS for your specific domains
- Avoid using wildcard origins in production
- Test cross-origin requests thoroughly

### 4. Rate Limiting
- Implement appropriate rate limits
- Monitor for abuse patterns
- Set up alerts for unusual activity

## Monitoring and Logging

### 1. Firebase Console Monitoring
- Monitor function execution times
- Track error rates and patterns
- Review usage metrics
- Set up performance alerts

### 2. Custom Analytics
- Track AI response metrics
- Monitor user engagement
- Measure clinical outcomes
- Generate usage reports

### 3. Error Handling
- Implement comprehensive error logging
- Set up error alerting
- Create error recovery procedures
- Regular log analysis

## Backup and Recovery

### 1. Database Backups
```bash
# Set up automated Firestore backups
gcloud firestore export gs://your-backup-bucket/firestore-backup
```

### 2. Function Code Backups
- Maintain version control with Git
- Tag releases for easy rollback
- Document deployment procedures
- Test recovery procedures

### 3. Configuration Backups
```bash
# Export Firebase configuration
firebase functions:config:get > config-backup.json
```

## Troubleshooting

### Common Issues

1. **Functions not deploying**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review function logs for errors

2. **Database permission errors**
   - Verify Firestore security rules
   - Check user authentication status
   - Review field-level permissions

3. **CORS errors**
   - Verify CORS configuration
   - Check request headers
   - Test with different browsers

4. **AI responses not working**
   - Verify OpenAI API key configuration
   - Check API usage limits
   - Review function logs for errors

### Getting Help

- Check Firebase Console logs
- Review function execution logs
- Test with Firebase emulators
- Consult Firebase documentation
- Contact support if needed

---

For additional support, refer to the main README.md file or contact the development team.

