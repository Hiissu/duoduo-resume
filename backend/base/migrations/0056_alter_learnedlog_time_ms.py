# Generated by Django 4.1.2 on 2022-11-15 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0055_rolecourse_remove_usermoderator_moderator_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="learnedlog",
            name="time_ms",
            field=models.BigIntegerField(default=0),
        ),
    ]