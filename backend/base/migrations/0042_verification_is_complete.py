# Generated by Django 4.0.6 on 2022-08-20 05:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0041_alter_profile_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='verification',
            name='is_complete',
            field=models.BooleanField(default=False),
        ),
    ]
