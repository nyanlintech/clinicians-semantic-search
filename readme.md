## �� Quick Start Scripts

### Development
```bash
# Start backend with local database
./scripts/dev/start-local-db.sh

# Start backend with Supabase
./scripts/dev/start-supabase.sh

# Start frontend
./scripts/dev/start-frontend.sh

# Start full stack locally
./scripts/dev/start-all-local.sh
```

### Database Management
```bash
# Setup local database
./scripts/utils/setup-db.sh local

# Setup Supabase database
./scripts/utils/setup-db.sh supabase

# Load therapist data
./scripts/utils/migrate-data.sh load

# Clean encoding issues
./scripts/utils/migrate-data.sh clean
```

### Deployment
```bash
# Deploy backend
./scripts/deploy/deploy-backend.sh

# Deploy frontend
./scripts/deploy/deploy-frontend.sh

# Deploy everything
./scripts/deploy/deploy-all.sh
```

### Utilities
```bash
# Check system status
./scripts/utils/check-status.sh

# Show all available commands
./scripts/dev.sh
```
```
