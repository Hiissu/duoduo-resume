from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from PIL import Image

from base.models import Course


class Command(BaseCommand):
    help = 'Convert image2WebP. Command: convert_img2webp'

    def handle(self, *args, **options):
        try:
            source = settings.BASE_DIR / f"static/images/avatars/default/default.jpg"
            destination = source.with_suffix(".webp")
            image = Image.open(source)
            image.save(destination, format="webp")

            self.stdout.write(
                self.style.SUCCESS('Successfully! Converted image2WebP'))
        except:
            self.stdout.write(
                self.style.ERROR('Something went wrong when converting image2WebP'))
