from rest_framework import serializers
from .models import Account

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'email', 'password', 'hpnum', 'is_admin', 'is_superuser', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def validate(self, data):
        if ('is_admin' in data and data['is_admin'] is True
                and self.context['request'].user.is_superuser is False):
            raise serializers.ValidationError("FUnauthorized")
        if ('is_superuser' in data and data['is_superuser'] is True
                and self.context['request'].user.is_superuser is False):
            raise serializers.ValidationError("Unauthorized")
        if ('is_staff' in data and data['is_staff'] is True
                and self.context['request'].user.is_superuser is False):
            raise serializers.ValidationError("Unauthorized")
        return data