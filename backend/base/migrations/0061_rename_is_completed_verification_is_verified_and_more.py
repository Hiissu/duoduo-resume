# Generated by Django 4.1.2 on 2023-01-03 08:08

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0060_unit_cefr_level"),
    ]

    operations = [
        migrations.RenameField(
            model_name="verification",
            old_name="is_completed",
            new_name="is_verified",
        ),
        migrations.AddField(
            model_name="verification",
            name="date_expired",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
    ]
