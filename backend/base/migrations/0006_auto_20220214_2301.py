# Generated by Django 3.2 on 2022-02-14 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_rename_thumbnail_url_lesson_banner_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='num_lessons',
        ),
        migrations.AddField(
            model_name='language',
            name='num_lessons',
            field=models.IntegerField(default=0),
        ),
    ]
