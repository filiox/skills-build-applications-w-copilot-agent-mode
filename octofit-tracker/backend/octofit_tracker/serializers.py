from rest_framework import serializers
from bson import ObjectId
from .models import User, Team, Activity, Workout, Leaderboard


class ObjectIdField(serializers.Field):
    """Custom field to handle MongoDB ObjectId serialization"""
    
    def to_representation(self, value):
        """Convert ObjectId to string for JSON serialization"""
        if isinstance(value, ObjectId):
            return str(value)
        return str(value) if value else None
    
    def to_internal_value(self, data):
        """Convert string back to ObjectId for MongoDB"""
        try:
            return ObjectId(data)
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId format")


class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Team
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    team = ObjectIdField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    user = ObjectIdField()
    
    class Meta:
        model = Activity
        fields = '__all__'


class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    
    class Meta:
        model = Workout
        fields = '__all__'


class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    team = ObjectIdField()
    
    class Meta:
        model = Leaderboard
        fields = '__all__'
