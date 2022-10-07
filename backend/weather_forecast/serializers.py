from rest_framework import serializers

from .models import UserModel, HistoryModel


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ['id', 'first_name', 'last_name', 'username', 'email']

    def update(self, instance, validated_data):
        """Update user information."""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance

class UserAdministrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = [
            'username', 'first_name', 'last_name', 'is_staff', 'is_superuser',
            'id', 'email', 'date_joined', 'is_active', 'last_login'
        ]
        read_only_fields = [
            'id', 'email', 'date_joined', 'is_active', 'last_login'
        ]

    def update(self, instance, validated_data):
        """Update users_list information."""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ['password',]

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance

class StatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ['id', 'is_superuser']

class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = HistoryModel
        fields = ['id', 'date', 'user', 'location', 'forecast']

    def create(self, validated_data):
        """Create user history."""
        history = HistoryModel.objects.create(
            user = validated_data.get('user'),
            location = validated_data.get('location'),
            forecast = validated_data.get('forecast')
        )
        return history
