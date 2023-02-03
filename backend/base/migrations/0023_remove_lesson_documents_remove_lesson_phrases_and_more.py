# Generated by Django 4.0.3 on 2022-05-06 03:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0022_alter_phrasetranslation_translation_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='documents',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='phrases',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='sentences',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='topics',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='words',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='course_learning',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='courses_learning',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='lessons_created',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='lessons_learning',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='phrase_trans_created',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='phrase_trans_using',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='phrases_learned',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='sentence_trans_created',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='sentence_trans_using',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='sentences_learned',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='word_trans_created',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='word_trans_using',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='words_learned',
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('name', models.TextField(blank=True, max_length=220, null=True)),
                ('content', models.JSONField(blank=True, default=dict, null=True)),
                ('is_verified', models.BooleanField(default=False)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('language', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
            ],
            options={
                'db_table': 'duoduo_document',
            },
        ),
    ]
