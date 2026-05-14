#!/usr/bin/env bash
# =====================================================
# Script de deploy al Raspberry Pi
# Uso: ./scripts/deploy-rpi.sh pi@192.168.1.50
# =====================================================

set -e  # falla rápido si algo va mal

if [ -z "$1" ]; then
  echo "❌ Falta el destino. Uso:"
  echo "   ./scripts/deploy-rpi.sh pi@192.168.1.50"
  exit 1
fi

DEST="$1"
REMOTE_TMP="/tmp/dist-deploy"
WEB_ROOT="/var/www/html"

echo "🔨 Building con Vite..."
npm run build

echo "📦 Comprimiendo dist/..."
tar -czf /tmp/dist.tar.gz -C dist .

echo "📤 Copiando a $DEST..."
scp /tmp/dist.tar.gz "$DEST:/tmp/dist.tar.gz"

echo "🚀 Desplegando en el Pi..."
ssh "$DEST" "
  mkdir -p $REMOTE_TMP &&
  tar -xzf /tmp/dist.tar.gz -C $REMOTE_TMP &&
  sudo rm -rf $WEB_ROOT/* &&
  sudo cp -r $REMOTE_TMP/* $WEB_ROOT/ &&
  sudo chown -R www-data:www-data $WEB_ROOT &&
  rm -rf $REMOTE_TMP /tmp/dist.tar.gz &&
  sudo systemctl reload nginx
"

rm /tmp/dist.tar.gz

echo "✅ Deploy completado en $DEST"
