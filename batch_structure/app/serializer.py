from rest_framework import serializers
from .models import UserProfile, Topic, Batch, ClassSlot, SelectedSlot
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone']

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'

class ClassSlotSerializer(serializers.ModelSerializer):
    topic_name = serializers.CharField(source="topic.name", read_only=True)
    class Meta:
        model = ClassSlot
        fields = "__all__"

class SelectedSlotSerializer(serializers.ModelSerializer):
    slot_detail = ClassSlotSerializer(source='slot', read_only=True)
    class Meta:
        model = SelectedSlot
        fields = "__all__"