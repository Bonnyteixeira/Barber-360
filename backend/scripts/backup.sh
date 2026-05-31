#!/bin/bash

# ====================================================================
# BARBER 360 ENTERPRISE BACKUP ENGINE
# ====================================================================

# Terminate process if any command returns non-zero error
set -e

# Variable declarations
BACKUP_DIR="/usr/src/app/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/barber360_prod_db_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="barber360_postgres_prod"
DB_NAME="barber360_db"
DB_USER="barber_owner"

# Create storage directory
mkdir -p "${BACKUP_DIR}"

echo "[BACKUP] Initiating cron database backup for ${DB_NAME}..."

# Execute pg_dump within docker container and compress output
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
  docker exec -t ${CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} | gzip > "${BACKUP_FILE}"
  echo "[BACKUP] Backup successfully created at: ${BACKUP_FILE}"
  
  # Retention Policy: Clean backups older than 15 days
  echo "[BACKUP] Enforcing retention policy: pruning backups older than 15 days..."
  find "${BACKUP_DIR}" -type f -name "barber360_prod_db_*.sql.gz" -mtime +15 -delete
  echo "[BACKUP] Backup routine completed."
else
  echo "[ERROR] Source Postgres container is not running. Backup operation aborted!"
  exit 1
fi
