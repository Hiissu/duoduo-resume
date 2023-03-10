# Generated by Django 4.1.2 on 2022-11-27 09:40

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("base", "0056_alter_learnedlog_time_ms"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Lesson",
            new_name="Collection",
        ),
        migrations.RemoveField(
            model_name="newphrase",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="newphrase",
            name="language",
        ),
        migrations.RemoveField(
            model_name="newphrasecredit",
            name="phrase",
        ),
        migrations.RemoveField(
            model_name="newphrasecredit",
            name="user",
        ),
        migrations.RemoveField(
            model_name="newsentence",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="newsentence",
            name="language",
        ),
        migrations.RemoveField(
            model_name="newsentencecredit",
            name="sentence",
        ),
        migrations.RemoveField(
            model_name="newsentencecredit",
            name="user",
        ),
        migrations.RemoveField(
            model_name="newword",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="newword",
            name="language",
        ),
        migrations.RemoveField(
            model_name="newwordcredit",
            name="user",
        ),
        migrations.RemoveField(
            model_name="newwordcredit",
            name="word",
        ),
        migrations.RemoveField(
            model_name="phrasetrancredit",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="phrasetrancredit",
            name="user",
        ),
        migrations.RemoveField(
            model_name="phrasetranrequest",
            name="requestor",
        ),
        migrations.RemoveField(
            model_name="phrasetranrequest",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="phrasetranresponse",
            name="request",
        ),
        migrations.RemoveField(
            model_name="phrasetranresponse",
            name="responsor",
        ),
        migrations.RemoveField(
            model_name="phrasetranrevision",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="phrasetranrevision",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="phrasetranusing",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="phrasetranusing",
            name="user",
        ),
        migrations.RemoveField(
            model_name="sentencetrancredit",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="sentencetrancredit",
            name="user",
        ),
        migrations.RemoveField(
            model_name="sentencetranrequest",
            name="requestor",
        ),
        migrations.RemoveField(
            model_name="sentencetranrequest",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="sentencetranresponse",
            name="request",
        ),
        migrations.RemoveField(
            model_name="sentencetranresponse",
            name="responsor",
        ),
        migrations.RemoveField(
            model_name="sentencetranrevision",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="sentencetranrevision",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="sentencetranusing",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="sentencetranusing",
            name="user",
        ),
        migrations.RemoveField(
            model_name="wordtrancredit",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="wordtrancredit",
            name="user",
        ),
        migrations.RemoveField(
            model_name="wordtranrequest",
            name="requestor",
        ),
        migrations.RemoveField(
            model_name="wordtranrequest",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="wordtranresponse",
            name="request",
        ),
        migrations.RemoveField(
            model_name="wordtranresponse",
            name="responsor",
        ),
        migrations.RemoveField(
            model_name="wordtranrevision",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="wordtranrevision",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="wordtranusing",
            name="translation",
        ),
        migrations.RemoveField(
            model_name="wordtranusing",
            name="user",
        ),
        migrations.RenameField(
            model_name="phrasetranslation",
            old_name="is_verified",
            new_name="is_default",
        ),
        migrations.RenameField(
            model_name="sentencetranslation",
            old_name="is_verified",
            new_name="is_default",
        ),
        migrations.RenameField(
            model_name="unit",
            old_name="lesson",
            new_name="collection",
        ),
        migrations.RenameField(
            model_name="wordtranslation",
            old_name="is_verified",
            new_name="is_default",
        ),
        migrations.RemoveField(
            model_name="phrasetranslation",
            name="num_credits",
        ),
        migrations.RemoveField(
            model_name="phrasetranslation",
            name="num_users",
        ),
        migrations.RemoveField(
            model_name="sentencetranslation",
            name="num_credits",
        ),
        migrations.RemoveField(
            model_name="sentencetranslation",
            name="num_users",
        ),
        migrations.RemoveField(
            model_name="wordtranslation",
            name="num_credits",
        ),
        migrations.RemoveField(
            model_name="wordtranslation",
            name="num_users",
        ),
        migrations.AlterModelTable(
            name="collection",
            table="duoduo_collection",
        ),
        migrations.DeleteModel(
            name="LessonLearning",
        ),
        migrations.DeleteModel(
            name="NewPhrase",
        ),
        migrations.DeleteModel(
            name="NewPhraseCredit",
        ),
        migrations.DeleteModel(
            name="NewSentence",
        ),
        migrations.DeleteModel(
            name="NewSentenceCredit",
        ),
        migrations.DeleteModel(
            name="NewWord",
        ),
        migrations.DeleteModel(
            name="NewWordCredit",
        ),
        migrations.DeleteModel(
            name="PhraseTranCredit",
        ),
        migrations.DeleteModel(
            name="PhraseTranRequest",
        ),
        migrations.DeleteModel(
            name="PhraseTranResponse",
        ),
        migrations.DeleteModel(
            name="PhraseTranRevision",
        ),
        migrations.DeleteModel(
            name="PhraseTranUsing",
        ),
        migrations.DeleteModel(
            name="SentenceTranCredit",
        ),
        migrations.DeleteModel(
            name="SentenceTranRequest",
        ),
        migrations.DeleteModel(
            name="SentenceTranResponse",
        ),
        migrations.DeleteModel(
            name="SentenceTranRevision",
        ),
        migrations.DeleteModel(
            name="SentenceTranUsing",
        ),
        migrations.DeleteModel(
            name="WordTranCredit",
        ),
        migrations.DeleteModel(
            name="WordTranRequest",
        ),
        migrations.DeleteModel(
            name="WordTranResponse",
        ),
        migrations.DeleteModel(
            name="WordTranRevision",
        ),
        migrations.DeleteModel(
            name="WordTranUsing",
        ),
    ]
