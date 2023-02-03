from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField,
)

from .models import *

# ---- User Serializer ----
# ---- Profile Serializer ----
# ---- Language Serializer ----


class LanguageSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = [
            "id",
            "language",
            "language_code",
            "flag",
            "use_space",
        ]


# ---- Course Serializer ----
class CourseSerializer(ModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            "language_learning",
            "language_speaking",
            "num_learners",
        ]

    def get_name(self, course):
        return course.__str__()


# ---- Category Serializer ----


class CategorySerializer(ModelSerializer):
    topics = SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "topics"]

    def get_topics(self, category):
        return TopicSerializer(category.topics.all().order_by("name"), many=True).data


# ---- Topic Serializer ----


class TopicSerializer(ModelSerializer):
    class Meta:
        model = Topic
        fields = [
            "id",
            "name",
        ]


# ---- Word Serializer ----
class WordSerializer(ModelSerializer):
    class Meta:
        model = Word
        fields = ["id", "word"]


# ---- Phrase Serializer ----


class PhraseSerializer(ModelSerializer):
    class Meta:
        model = Phrase
        fields = [
            "id",
            "phrase",
        ]


# ---- Sentence Serializer ----


class SentenceSerializer(ModelSerializer):
    class Meta:
        model = Sentence
        fields = [
            "id",
            "sentence",
        ]
