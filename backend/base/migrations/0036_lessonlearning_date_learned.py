# Generated by Django 4.0.6 on 2022-08-08 08:43

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0035_learned_remove_sentencelearned_language_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lessonlearning',
            name='date_learned',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
