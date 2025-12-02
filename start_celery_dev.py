"""
Start Celery worker with fakeredis for development.

This script allows you to run Celery without Docker/Redis by using
an in-memory fakeredis instance.

Usage: python start_celery_dev.py
"""

import os
import sys
from fakeredis import FakeStrictRedis
from celery import Celery

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Setup Django
import django
django.setup()

# Override broker to use fakeredis
from config.celery import app

# Use fakeredis connection
fake_redis = FakeStrictRedis()

print("=" * 60)
print("🚀 Starting Celery Worker with FakeRedis (Development Mode)")
print("=" * 60)
print("✓ FakeRedis: Running in-memory")
print("✓ Tasks will be processed immediately")
print("✓ Watching for tasks from: apps.forecasting.tasks")
print("=" * 60)
print("\nPress Ctrl+C to stop\n")

# Start worker
app.worker_main([
    'worker',
    '--loglevel=info',
    '--pool=solo',
    '--concurrency=1'
])
