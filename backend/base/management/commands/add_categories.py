import json

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from base.models import Category, Topic


class Command(BaseCommand):
    help = 'Add categories ~ topics. Command: add_categories'

    def handle(self, *args, **options):
        try:
            categories_path = settings.BASE_DIR / f"documents/categories/categories_raw.json"
            with open(categories_path, 'r') as categories_raw:
                categories = json.load(categories_raw)
                for category in categories:
                    new_category = Category.objects.create(
                        name=category['name'])
                    new_category.save()
                    self.stdout.write(
                        self.style.SUCCESS(f'Added new category: {new_category.name} ~ id: {new_category.id}'))
                    for topic in category['topics']:
                        new_topic = Topic.objects.create(name=topic)
                        new_category.topics.add(new_topic)
                        self.stdout.write(
                            self.style.SUCCESS(f'Added new topic: {new_topic.name} ~ id: {new_topic.id}'))
        except:
            self.stdout.write(
                self.style.ERROR('Something went wrong when adding topics'))
