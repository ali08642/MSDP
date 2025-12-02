"""
Celery configuration for MSDP Backend.

This module sets up Celery for background task processing.
For development, we use fakeredis (in-memory) to avoid Docker/Redis setup.
For production, set REDIS_URL environment variable to real Redis.

Learning:
- Celery: Distributed task queue for async processing
- Redis: Message broker that holds task queue
- @shared_task: Decorator for reusable tasks across apps
"""

import os
from celery import Celery

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Create Celery app
app = Celery('msdp_backend')

# Load config from Django settings with CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task to test Celery is working."""
    print(f'Request: {self.request!r}')
