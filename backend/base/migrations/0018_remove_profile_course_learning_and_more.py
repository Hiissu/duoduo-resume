# Generated by Django 4.0.3 on 2022-04-27 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0017_profile_courses_learning_profile_phrases_learned_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='course_learning',
        ),
        migrations.AddField(
            model_name='profile',
            name='phrase_trans_using',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='sentence_trans_using',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='word_trans_using',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
