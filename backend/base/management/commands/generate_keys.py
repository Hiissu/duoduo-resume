from django.core.management.base import BaseCommand, CommandError
from base.api.views.encryption import *


class Command(BaseCommand):
    help = 'Renew the newest words. Command: generate_keys'

    def handle(self, *args, **options):
        try:
            RSAEncryption().generate_keys()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully! Generated keys'))
        except:
            self.stdout.write(
                self.style.ERROR(f"Something went wrong when generating keys"))
