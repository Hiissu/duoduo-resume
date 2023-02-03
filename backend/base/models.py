import uuid
from io import BytesIO, StringIO

from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.db import models
from PIL import Image

""" Profile Models """


def avatar_uploads2(instance, filename):
    hex_name = f"{uuid.uuid1().hex}.webp"
    return f"avatars/{instance.user.id}/{hex_name}"


class Profile(models.Model):
    class Meta:
        db_table = "duoduo_profile"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to=avatar_uploads2,
        default="avatars/default/default.webp",
        max_length=2020,
        null=True,
        blank=True,
    )
    # avatar = models.TextField(max_length=2020, null=True, blank=True)

    name = models.CharField(max_length=220, null=True, blank=True)
    bio = models.CharField(max_length=220, null=True, blank=True)
    day_streak = models.IntegerField(default=0)

    email = models.EmailField(max_length=220, null=True, blank=True)
    email_verified = models.BooleanField(default=False)

    phone = models.CharField(max_length=20, null=True, blank=True)
    phone_verified = models.BooleanField(default=False)

    course_learning = models.ForeignKey(
        "Course", on_delete=models.SET_NULL, null=True, blank=True
    )

    """ [ ...course_ids ] """
    courses_learning_ids = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return f"id: {self.id} - user: {self.user}"

    def save(self, *args, **kwargs):
        memory_image = BytesIO(self.avatar.read())
        image = Image.open(memory_image)
        if image.height > 720 or image.width > 720:
            output_size = (720, 720)
            image.thumbnail(output_size)

        new_image = BytesIO()
        image.save(new_image, format="webp")

        hex_name = f"{uuid.uuid1().hex}.webp"
        new_image = ContentFile(new_image.getvalue())
        self.avatar = InMemoryUploadedFile(
            new_image, "ImageField", hex_name, "webp", None, None
        )
        super().save(*args, **kwargs)


""" Language Models """


class Language(models.Model):
    class Meta:
        db_table = "duoduo_language"

    language_list = [
        ("en", "English"),
        ("vi", "Vietnamese"),
        ("de", "German"),
        ("ja", "Japanese"),
    ]

    language_code = models.CharField(
        max_length=5, unique=True, choices=language_list, null=True, blank=True
    )
    language = models.CharField(max_length=220, unique=True)
    use_space = models.BooleanField(default=True)

    """ [ ...ids ] """
    word_ids = models.JSONField(null=True, blank=True, default=list)
    phrase_ids = models.JSONField(null=True, blank=True, default=list)
    sentence_ids = models.JSONField(null=True, blank=True, default=list)

    flag = models.ImageField(upload_to="flags/", default="flags/default.png")
    # flag = models.TextField(max_length=2020, null=True, blank=True)

    def __str__(self):
        return self.language


""" Course Models """


class Course(models.Model):
    class Meta:
        db_table = "duoduo_course"
        unique_together = ["language_learning", "language_speaking"]

    language_learning = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name="+"
    )
    language_speaking = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name="+"
    )

    num_learners = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.language_learning} for {self.language_speaking} speakers"


""" Category Models """


class Topic(models.Model):
    class Meta:
        db_table = "duoduo_topic"

    name = models.CharField(max_length=220, unique=True)

    def __str__(self):
        return f"id:  {self.id}, topic: {self.name}"


class Category(models.Model):
    class Meta:
        db_table = "duoduo_category"

    name = models.CharField(max_length=220, unique=True)
    topics = models.ManyToManyField(Topic, null=True, blank=True)

    def __str__(self):
        return f"id:  {self.id}, category: {self.name}"


""" Verification Models """


class Verification(models.Model):
    class Meta:
        db_table = "duoduo_verification"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=220, null=True, blank=True)
    date_verified = models.DateTimeField(auto_now_add=True)
    date_expired = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    num_tries = models.SmallIntegerField(default=0)
    type_verification = models.SmallIntegerField(default=0)
    verification_code = models.TextField(max_length=2020, null=True, blank=True)

    def __str__(self):
        return f"id: {self.id}, user: {self.user}, email: {self.email}"


""" Word Models """


class Word(models.Model):
    class Meta:
        db_table = "duoduo_word"

    word = models.CharField(max_length=220, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"id: {self.id}, word: {self.word}, language: {self.language}"


class NewWord(models.Model):
    class Meta:
        db_table = "duoduo_new_word"

    word = models.CharField(max_length=220, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    num_credits = models.IntegerField(default=0)

    status_type = models.SmallIntegerField(default=0)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


class NewWordTran(models.Model):
    class Meta:
        db_table = "duoduo_new_word_translation"

    new_word = models.ForeignKey(NewWord, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    translation = models.JSONField(null=True, blank=True, default=dict)
    num_credits = models.IntegerField(default=0)

    status_type = models.SmallIntegerField(default=0)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


class NewWordCredit(models.Model):
    class Meta:
        db_table = "duoduo_new_word_credit"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(NewWord, on_delete=models.CASCADE)
    vote = models.BooleanField(default=False)


class NewWordTranCredit(models.Model):
    class Meta:
        db_table = "duoduo_new_word_translation_credit"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    translation = models.ForeignKey(NewWordTran, on_delete=models.CASCADE)
    vote = models.BooleanField(default=False)


""" WordTranslation Models """


class WordTranslation(models.Model):
    class Meta:
        db_table = "duoduo_word_translation"

    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_default = models.BooleanField(default=False)
    translation = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return f"id: {self.id}, word: {self.word}, creator: {self.creator}"


class WordTranRevision(models.Model):
    class Meta:
        db_table = "duoduo_word_translation_revision"

    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    translation = models.ForeignKey(WordTranslation, on_delete=models.CASCADE)

    date_created = models.DateTimeField(auto_now=True)
    new_translation = models.JSONField(null=True, blank=True, default=dict)
    request_logs = models.JSONField(null=True, blank=True, default=list)

    approve = models.BooleanField(default=False)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


class WordTranRequest(models.Model):
    class Meta:
        db_table = "duoduo_word_translation_request"

    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    translation = models.ForeignKey(WordTranslation, on_delete=models.CASCADE)

    requestor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    request = models.TextField(max_length=2020, null=True, blank=True)
    date_requested = models.DateTimeField(auto_now_add=True)
    status_type = models.SmallIntegerField(default=0)

    responsor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    response = models.TextField(max_length=2020, null=True, blank=True)
    date_responsed = models.DateTimeField(auto_now=True, null=True, blank=True)


""" Phrase Models """


class Phrase(models.Model):
    class Meta:
        db_table = "duoduo_phrase"

    phrase = models.CharField(max_length=220, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"id: {self.id}, phrase: {self.phrase}, language: {self.language}"


# class NewPhrase(models.Model):
#     class Meta:
#         db_table = "duoduo_new_phrase"

#     phrase = models.CharField(max_length=220, unique=True)
#     creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
#     date_created = models.DateTimeField(auto_now_add=True)
#     date_updated = models.DateTimeField(auto_now=True)
#     num_credits = models.IntegerField(default=0)

#     status_type = models.SmallIntegerField(default=0)
#     approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


# class NewPhraseTran(models.Model):
#     class Meta:
#         db_table = "duoduo_new_phrase_translation"

#     new_phrase = models.ForeignKey(NewPhrase, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
#     creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     date_created = models.DateTimeField(auto_now_add=True)
#     date_updated = models.DateTimeField(auto_now=True)
#     translation = models.JSONField(null=True, blank=True, default=dict)
#     num_credits = models.IntegerField(default=0)

#     status_type = models.SmallIntegerField(default=0)
#     approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


# class NewPhraseCredit(models.Model):
#     class Meta:
#         db_table = "duoduo_new_phrase_credit"

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     phrase = models.ForeignKey(NewPhrase, on_delete=models.CASCADE)
#     vote = models.BooleanField(default=False)


# class NewPhraseTranCredit(models.Model):
#     class Meta:
#         db_table = "duoduo_new_phrase_translation_credit"

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     translation = models.ForeignKey(NewPhraseTran, on_delete=models.CASCADE)
#     vote = models.BooleanField(default=False)


""" PhraseTranslation Models """


class PhraseTranslation(models.Model):
    class Meta:
        db_table = "duoduo_phrase_translation"

    phrase = models.ForeignKey(Phrase, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_default = models.BooleanField(default=False)
    translation = models.JSONField(null=True, blank=True, default=dict)


# class PhraseTranRevision(models.Model):
#     class Meta:
#         db_table = "duoduo_phrase_translation_revision"

#     course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
#     creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     translation = models.ForeignKey(PhraseTranslation, on_delete=models.CASCADE)

#     date_created = models.DateTimeField(auto_now=True)
#     new_translation = models.JSONField(null=True, blank=True, default=dict)
#     request_logs = models.JSONField(null=True, blank=True, default=list)

#     approve = models.BooleanField(default=False)
#     approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


# class PhraseTranRequest(models.Model):
#     class Meta:
#         db_table = "duoduo_phrase_translation_request"

#     course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
#     translation = models.ForeignKey(PhraseTranslation, on_delete=models.CASCADE)
#     requestor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     request = models.TextField(max_length=2020, null=True, blank=True)
#     date_requested = models.DateTimeField(auto_now_add=True)
#     status_type = models.SmallIntegerField(default=0)

#     responsor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_responsed = models.DateTimeField(auto_now=True, null=True, blank=True)
#     response = models.TextField(max_length=2020, null=True, blank=True)


""" Sentence Models """


class Sentence(models.Model):
    class Meta:
        db_table = "duoduo_sentence"

    sentence = models.TextField(max_length=2020, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"id: {self.id}, sentence: {self.sentence}"


# class NewSentence(models.Model):
#     class Meta:
#         db_table = "duoduo_new_sentence"

#     sentence = models.CharField(max_length=220, unique=True)
#     creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
#     date_created = models.DateTimeField(auto_now_add=True)
#     date_updated = models.DateTimeField(auto_now=True)
#     num_credits = models.IntegerField(default=0)

#     status_type = models.SmallIntegerField(default=0)
#     approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


# class NewSentenceTran(models.Model):
#     class Meta:
#         db_table = "duoduo_new_sentence_translation"

#     new_sentence = models.ForeignKey(NewSentence, on_delete=models.CASCADE)
#     course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
#     creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     date_created = models.DateTimeField(auto_now_add=True)
#     date_updated = models.DateTimeField(auto_now=True)
#     translation = models.JSONField(null=True, blank=True, default=dict)
#     num_credits = models.IntegerField(default=0)

#     status_type = models.SmallIntegerField(default=0)
#     approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


# class NewSentenceCredit(models.Model):
#     class Meta:
#         db_table = "duoduo_new_sentence_credit"

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     sentence = models.ForeignKey(NewSentence, on_delete=models.CASCADE)
#     vote = models.BooleanField(default=False)


# class NewSentenceTranCredit(models.Model):
#     class Meta:
#         db_table = "duoduo_new_sentence_translation_credit"

#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     translation = models.ForeignKey(NewSentenceTran, on_delete=models.CASCADE)
#     vote = models.BooleanField(default=False)


""" SentenceTranslation Models """


class SentenceTranslation(models.Model):
    class Meta:
        db_table = "duoduo_sentence_translation"

    sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_default = models.BooleanField(default=False)
    translation = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return f"id: {self.id}, sentence: {self.sentence}, creator: {self.creator}"


# class SentenceTranRevision(models.Model):
#     class Meta:
#         db_table = "duoduo_sentence_translation_revision"

#     course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
#     creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     translation = models.ForeignKey(SentenceTranslation, on_delete=models.CASCADE)

#     date_created = models.DateTimeField(auto_now=True)
#     new_translation = models.JSONField(null=True, blank=True, default=dict)
#     request_logs = models.JSONField(null=True, blank=True, default=list)

#     approve = models.BooleanField(default=False)
#     approver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     date_approved = models.DateTimeField(auto_now=True, null=True, blank=True)


# class SentenceTranRequest(models.Model):
#     class Meta:
#         db_table = "duoduo_sentence_translation_request"

#     course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
#     translation = models.ForeignKey(SentenceTranslation, on_delete=models.CASCADE)
#     requestor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
#     request = models.TextField(max_length=2020, null=True, blank=True)
#     date_requested = models.DateTimeField(auto_now=True)
#     status_type = models.SmallIntegerField(default=0)

#     responsor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     response = models.TextField(max_length=2020, null=True, blank=True)
#     date_responsed = models.DateTimeField(auto_now=True, null=True, blank=True)


""" Collection Models """


class Collection(models.Model):
    class Meta:
        db_table = "duoduo_collection"

    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=220, null=True, blank=True)
    description = models.CharField(max_length=220, null=True, blank=True)
    banner_url = models.TextField(max_length=2020, null=True, blank=True)
    num_learners = models.IntegerField(default=1)

    """ [...topic_ids] """
    topics = models.JSONField(null=True, blank=True, default=list)
    # https://ant.design/components/tag

    """ [{name:  "", content: "", version: ""}] """
    documents = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return f"id: {self.id}, collection: {self.name[:69]}, creator: {self.creator}"


class CollectionLearning(models.Model):
    class Meta:
        db_table = "duoduo_collection_learning"
        unique_together = ["learner", "collection"]

    learner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True)
    date_learned = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"collection: {self.collection}, learner: {self.learner}"


class CollectionReview(models.Model):
    class Meta:
        db_table = "duoduo_collection_review"
        unique_together = ["reviewer", "collection"]

    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True)
    date_reviewd = models.DateTimeField(auto_now_add=True)
    review = models.TextField(max_length=2020, null=True, blank=True)
    rating_value = models.SmallIntegerField(default=0)

    """
        SELECT duoduo_collection.id, averages.avg_rating
        FROM duoduo_collection
        INNER JOIN (
            SELECT collection_id, AVG(rating_value) AS avg_rating
            FROM duoduo_collection_review
            GROUP BY collection_id
        ) AS averages ON averages.collection_id = duoduo_collection.id
    """


""" Unit Models """


class Unit(models.Model):
    class Meta:
        db_table = "duoduo_unit"

    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=220, null=True, blank=True)
    description = models.CharField(max_length=220, null=True, blank=True)
    cefr_level = models.CharField(max_length=220, null=True, blank=True)

    """ [...word_ids] """
    words = models.JSONField(null=True, blank=True, default=list)
    phrases = models.JSONField(null=True, blank=True, default=list)
    sentences = models.JSONField(null=True, blank=True, default=list)

    """ [{word: "", translation: {}}] """
    unknown_words = models.JSONField(null=True, blank=True, default=list)
    unknown_phrases = models.JSONField(null=True, blank=True, default=list)
    unknown_sentences = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return f"id: {self.id}, unit: {self.name[:69]}, creator: {self.creator}"


""" Learned Models """


class Learned(models.Model):
    class Meta:
        db_table = "duoduo_learned"

    learner = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)

    """ [{id: _, writing: _, reading: _, speaking: _, listening: _}] """
    words = models.JSONField(null=True, blank=True, default=list)
    phrases = models.JSONField(null=True, blank=True, default=list)
    sentences = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return f"id: {self.id}, learner: {self.learner}, language: {self.language}"


class LearnedLog(models.Model):
    class Meta:
        db_table = "duoduo_learned_log"

    learner = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    date_learned = models.DateTimeField(auto_now_add=True)
    time_ms = models.BigIntegerField(default=0)

    """ [{id: _, writing: _, reading: _, speaking: _, listening: _}] """
    words = models.JSONField(null=True, blank=True, default=list)
    phrases = models.JSONField(null=True, blank=True, default=list)
    sentences = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return f"id: {self.id}, learner: {self.learner}, language: {self.language}, date: {self.date_learned}"


""" Subscription Models """


class Subscription(models.Model):
    class Meta:
        db_table = "duoduo_subscription"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_subscribed = models.DateTimeField(auto_now_add=True)
    date_expired = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"id: {self.id}, user: {self.user}"


""" Role Models """


class Role(models.Model):
    class Meta:
        db_table = "duoduo_role"

    name = models.CharField(max_length=220, unique=True)

    def __str__(self):
        return f"id: {self.id}, role: {self.name}"


class UserRole(models.Model):
    class Meta:
        db_table = "duoduo_user_role"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"id: {self.id}, user: {self.user}, role: {self.role.name}"


class RoleCourse(models.Model):
    class Meta:
        db_table = "duoduo_role_course"

    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f"id: {self.id}, role: {self.role.name}, course: {self.course}"


class BlackList(models.Model):
    class Meta:
        db_table = "duoduo_blacklist"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.CharField(max_length=2020, null=True, blank=True)
    severity = models.SmallIntegerField(default=0)
    date_banned = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    date_released = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"id: {self.id}, severity: {self.severity}, reason: {self.reason[:69]}"


class UsernameChangedLog(models.Model):
    class Meta:
        db_table = "duoduo_username_changed_log"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    old_username = models.CharField(max_length=220, null=True, blank=True)
    new_username = models.CharField(max_length=220, null=True, blank=True)
    date_changed = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"id: {self.user}, username: {self.username}"


# class Follow(models.Model):
#     follower = models.ForeignKey(User, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     date_followed = models.DateTimeField(auto_now_add=True)

"""
# observed ClassroomIds - Badges
class or guild for user to compete

@deprecated
Add white background - https://stackoverflow.com/questions/9166400/convert-rgba-png-to-rgb-with-pil

@deprecated
class WordTranUsing(models.Model):
    class Meta:
        db_table = "duoduo_word_translation_using"
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    translation = models.ForeignKey(WordTranslation, on_delete=models.CASCADE)

@deprecated
class PhraseTranUsing(models.Model):
    class Meta:
        db_table = "duoduo_phrase_translation_using"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    translation = models.ForeignKey(PhraseTranslation, on_delete=models.CASCADE)

@deprecated
class SentenceTranUsing(models.Model):
    class Meta:
        db_table = "duoduo_sentence_translation_using"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    translation = models.ForeignKey(SentenceTranslation, on_delete=models.CASCADE)

"""
