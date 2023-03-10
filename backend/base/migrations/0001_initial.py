# Generated by Django 3.2 on 2022-02-10 04:16

import base.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('num_lessons', models.IntegerField(default=0)),
                ('num_learners', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(choices=[('all', 'All languages'), ('en', 'English'), (
                    'vi', 'Vietnamese'), ('de', 'German'), ('ja', 'Japanese')], max_length=5, unique=True)),
                ('flag', models.ImageField(
                    default='flags/default.png', upload_to='flags/')),
                ('num_words', models.IntegerField(default=0)),
                ('num_phrases', models.IntegerField(default=0)),
                ('num_sentences', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='LearnerStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('words_learned', models.IntegerField(default=0)),
                ('phrases_learned', models.IntegerField(default=0)),
                ('sentences_learned', models.IntegerField(default=0)),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_updated', models.DateTimeField(auto_now=True)),
                ('name', models.TextField(blank=True, max_length=220, null=True)),
                ('description', models.TextField(
                    blank=True, max_length=220, null=True)),
                ('tips', models.TextField(blank=True, null=True)),
                ('num_learners', models.IntegerField(default=1)),
                ('creator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                 related_name='lessons_created', to=settings.AUTH_USER_MODEL)),
                ('language', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                 related_name='lessons_in_language', to='base.language')),
            ],
        ),
        migrations.CreateModel(
            name='Phrase',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('phrase', models.CharField(max_length=220, unique=True)),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PhraseTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('ipa', models.CharField(blank=True, max_length=2020, null=True)),
                ('translations', models.TextField()),
                ('num_users', models.IntegerField(default=0)),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('phrase', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.phrase')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PhraseTransUsing',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('translation', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.phrasetranslation')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                # ('avatar', models.ImageField(default='uploads/avatars/default/default.webp', upload_to=base.models.avatar_uploads2)),
                ('name', models.CharField(blank=True, max_length=220, null=True)),
                ('bio', models.CharField(blank=True, max_length=220, null=True)),
                ('day_streak', models.IntegerField(default=0)),
                ('course_learning', models.ForeignKey(blank=True, null=True,
                 on_delete=django.db.models.deletion.SET_NULL, related_name='learners_learning', to='base.course')),
                ('courses_learning', models.ManyToManyField(blank=True, null=True,
                 related_name='learners_learning_course', through='base.LearnerStatus', to='base.Course')),
                ('lessons_learning', models.ManyToManyField(blank=True, null=True,
                 related_name='learners_learning_lesson', to='base.Lesson')),
                ('phrase_trans_using', models.ManyToManyField(blank=True, null=True,
                 related_name='users_using_phrase_trans', through='base.PhraseTransUsing', to='base.Course')),
            ],
        ),
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('sentence', models.TextField(max_length=2020, unique=True)),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SentenceTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('ipa', models.CharField(blank=True, max_length=2020, null=True)),
                ('translations', models.TextField()),
                ('num_users', models.IntegerField(default=0)),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sentence', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.sentence')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=220, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Word',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('word', models.CharField(max_length=220, unique=True)),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
                ('topics', models.ManyToManyField(
                    blank=True, null=True, to='base.Topic')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='WordTranslation',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('ipa', models.CharField(blank=True, max_length=2020, null=True)),
                ('translations', models.TextField()),
                ('num_users', models.IntegerField(default=0)),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('word', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.word')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='WordTransUsing',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('translation', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.wordtranslation')),
                ('user', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.CASCADE, to='base.profile')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='WordScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('last_practiced', models.DateTimeField(auto_now=True)),
                ('listening', models.FloatField(default=0)),
                ('speaking', models.FloatField(default=0)),
                ('reading', models.FloatField(default=0)),
                ('writing', models.FloatField(default=0)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('word', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.word')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SentenceTransUsing',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('translation', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.sentencetranslation')),
                ('user', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.CASCADE, to='base.profile')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SentenceScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('last_practiced', models.DateTimeField(auto_now=True)),
                ('listening', models.FloatField(default=0)),
                ('speaking', models.FloatField(default=0)),
                ('reading', models.FloatField(default=0)),
                ('writing', models.FloatField(default=0)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
                ('sentence', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.sentence')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='sentence',
            name='topics',
            field=models.ManyToManyField(
                blank=True, null=True, to='base.Topic'),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('question', models.TextField(max_length=2020)),
                ('solution', models.TextField(
                    blank=True, max_length=2020, null=True)),
                ('correct_answers', models.TextField(max_length=220)),
                ('incorrect_answers', models.TextField(max_length=220)),
                ('creator', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
                ('topics', models.ManyToManyField(
                    blank=True, null=True, to='base.Topic')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='profile',
            name='sentence_trans_using',
            field=models.ManyToManyField(
                blank=True, null=True, related_name='users_using_sentence_trans', through='base.SentenceTransUsing', to='base.Course'),
        ),
        migrations.AddField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='profile',
            name='word_trans_using',
            field=models.ManyToManyField(
                blank=True, null=True, related_name='users_using_word_trans', through='base.WordTransUsing', to='base.Course'),
        ),
        migrations.AddField(
            model_name='phrasetransusing',
            name='user',
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to='base.profile'),
        ),
        migrations.CreateModel(
            name='PhraseScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('last_practiced', models.DateTimeField(auto_now=True)),
                ('listening', models.FloatField(default=0)),
                ('speaking', models.FloatField(default=0)),
                ('reading', models.FloatField(default=0)),
                ('writing', models.FloatField(default=0)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
                ('phrase', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='base.phrase')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='phrase',
            name='topics',
            field=models.ManyToManyField(
                blank=True, null=True, to='base.Topic'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='phrases',
            field=models.ManyToManyField(
                blank=True, null=True, to='base.Phrase'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='sentences',
            field=models.ManyToManyField(
                blank=True, null=True, to='base.Sentence'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='topics',
            field=models.ManyToManyField(
                blank=True, null=True, to='base.Topic'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='words',
            field=models.ManyToManyField(
                blank=True, null=True, to='base.Word'),
        ),
        migrations.AddField(
            model_name='learnerstatus',
            name='learner',
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to='base.profile'),
        ),
        migrations.CreateModel(
            name='ExpRecorder',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('daily_exp', models.IntegerField(default=0)),
                ('date', models.DateTimeField(auto_now=True)),
                ('course', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='course',
            name='language_learning',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    related_name='courses_in_language_learning', to='base.language'),
        ),
        migrations.AddField(
            model_name='course',
            name='language_speaking',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    related_name='courses_in_language_speaking', to='base.language'),
        ),
        migrations.AlterUniqueTogether(
            name='learnerstatus',
            unique_together={('learner', 'course')},
        ),
        migrations.AlterUniqueTogether(
            name='course',
            unique_together={('language_learning', 'language_speaking')},
        ),
    ]
