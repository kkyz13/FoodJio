from rest_framework import serializers
from .models import Meet, CuisineType, MeetParticipants


class MeetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meet
        # fields = '__all__'
        # fields = ('title', 'address', 'website', 'meetdatetime', 'CuisineType')
        exclude = ('abuseflag', 'active')  #fields and exclude cannot work together, only one or the other

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError('Title has to be at least 5 characters long')
        return value

class CuisineSerializer(serializers.ModelSerializer):

    class Meta:
        model = CuisineType
        fields = '__all__'