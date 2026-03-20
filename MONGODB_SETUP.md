# MongoDB Setup Guide for RoutineWise

## Current Status

- ✅ Backend: Running successfully (http://localhost:5000)
- ✅ Frontend: Running successfully (http://localhost:5173)
- ❌ MongoDB: Not installed/running (database features unavailable)

## What This Means

**You can continue development without MongoDB!** The backend is configured to:
- Start successfully even if MongoDB is not available
- Show clear warnings about missing database
- Continue working for API testing and UI development

**You'll need MongoDB for:**
- Phase 2: Creating database schemas
- Phase 2+: Storing/retrieving user data, child profiles, routines, logs
- Testing database-related features

## MongoDB Setup Options

### Option 1: Docker (Recommended - Easiest)

**Prerequisites:** Docker installed (you have it! ✅)

**Quick Start:**
```bash
docker run -d --name routinewise-mongo -p 27017:27017 mongo:7
```

**What this does:**
- Downloads MongoDB 7 image (~500MB - may take 5-10 minutes on first run)
- Starts MongoDB in a Docker container
- Exposes MongoDB on port 27017
- Persists data until container is deleted

**Verify it's running:**
```bash
docker ps
# Should show "routinewise-mongo" container running
```

**Stop MongoDB:**
```bash
docker stop routinewise-mongo
```

**Start MongoDB again:**
```bash
docker start routinewise-mongo
```

**Remove MongoDB (if needed):**
```bash
docker stop routinewise-mongo
docker rm routinewise-mongo
```

### Option 2: Native Installation

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### macOS (with Homebrew)
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Windows
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Start MongoDB Service from Windows Services

### Option 3: MongoDB Atlas (Cloud - Free Tier)

**Best for:**
- No local installation required
- Easy setup
- Production-ready from start
- Free tier available (512MB storage)

**Steps:**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Select "Node.js" driver
6. Get connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/routinewise
   ```
7. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/routinewise
   ```
8. Add your IP address to MongoDB Atlas whitelist (0.0.0.0/0 for testing)

## Verification

### Test MongoDB Connection

**Option A: Using Backend Health Check**
```bash
curl http://localhost:5000/api/health
```

Expected response (with MongoDB):
```json
{
  "status": "ok",
  "message": "RoutineWise API is running",
  "database": "connected"
}
```

Expected response (without MongoDB):
```json
{
  "status": "ok",
  "message": "RoutineWise API is running",
  "database": "disconnected"
}
```

**Option B: Using MongoDB Shell**
```bash
mongosh
```

Then run:
```javascript
db.adminCommand('ping')
```

Should return:
```javascript
{ ok: 1 }
```

### Test Backend with MongoDB

Once MongoDB is running:
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📊 Health check: http://localhost:5000/api/health
✅ Database connected successfully
```

## Troubleshooting

### Docker: "Port 27017 already in use"
```bash
# Check what's using port 27017
sudo lsof -i :27017

# Stop conflicting MongoDB service
sudo systemctl stop mongodb

# Then try Docker again
docker run -d --name routinewise-mongo -p 27017:27017 mongo:7
```

### Docker: Container not starting
```bash
# Check container logs
docker logs routinewise-mongo

# Check container status
docker ps -a

# Try restarting
docker restart routinewise-mongo
```

### Native: MongoDB not starting
```bash
# Check MongoDB status
sudo systemctl status mongodb

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongodb.log

# Restart MongoDB
sudo systemctl restart mongodb
```

### MongoDB Atlas: Connection refused
1. Check IP whitelist includes your IP (or use 0.0.0.0/0 for testing)
2. Verify username and password are correct
3. Ensure cluster is created and running
4. Check network/firewall settings

## Quick Reference

### Start MongoDB

**Docker:**
```bash
docker start routinewise-mongo
```

**Systemd (Linux):**
```bash
sudo systemctl start mongodb
```

**Homebrew (macOS):**
```bash
brew services start mongodb-community
```

### Stop MongoDB

**Docker:**
```bash
docker stop routinewise-mongo
```

**Systemd (Linux):**
```bash
sudo systemctl stop mongodb
```

**Homebrew (macOS):**
```bash
brew services stop mongodb-community
```

### Check MongoDB Status

**Docker:**
```bash
docker ps | grep mongo
```

**Systemd:**
```bash
sudo systemctl status mongodb
```

**Process:**
```bash
ps aux | grep mongod
```

## Next Steps

1. **For now:** Continue development without MongoDB
   - Backend will show warnings but work fine
   - Frontend development is fully functional
   - You can test UI and API structure

2. **When ready for Phase 2:** Set up MongoDB
   - Choose one of the options above
   - Verify connection with health check
   - Restart backend to connect to database

3. **Recommended approach:**
   - Start with Docker option (easiest)
   - Run: `docker run -d --name routinewise-mongo -p 27017:27017 mongo:7`
   - Let it download in background (5-10 min)
   - Continue development in the meantime
   - Verify connection when download completes

## Additional Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Docker Documentation: https://docs.docker.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run: `cd backend && ./setup-mongodb.sh` for guided setup
3. Check MongoDB logs for detailed error messages
4. Review backend logs: `cd backend && npm run dev`
