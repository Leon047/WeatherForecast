import json

from django.shortcuts import get_object_or_404
from rest_framework import authentication, status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import UserModel, HistoryModel
from .services import openweather_api_requst
from .serializers import (UserSerializer,
                          HistorySerializer,
                          StatusSerializer,
                          ChangePasswordSerializer,
                          UserAdministrationSerializer)


class GestForecastView(APIView):

    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        """
        Accepts a location name, returns the weather forecast in json format.
        """
        location = request.query_params.get('location')
        forecast = openweather_api_requst(location)

        if forecast['cod'] == 200:
            return Response(forecast, status=status.HTTP_200_OK)
        else:
            return Response(forecast, status=status.HTTP_404_NOT_FOUND)

class UserForecastView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Accepts a location name, returns and saves
        the weather forecast in json format.
        """
        location = json.loads(request.body)
        forecast = openweather_api_requst(location['location'])

        if forecast['cod'] == 200:
            new_history = request.data
            token=request.headers['Authorization'].replace('Token ', '')
            user = UserModel.objects.get(auth_token=token)

            new_history['user'] = user.id
            new_history['location'] = forecast['name']
            new_history['forecast'] = forecast

            serializer = HistorySerializer(data=new_history)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(forecast['message'], status=status.HTTP_404_NOT_FOUND)

class HistoryListView(APIView, PageNumberPagination):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = HistoryModel.objects.all()
        serializer = HistorySerializer(queryset, many=True)

        if queryset:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        auth_token = request.headers['Authorization'].replace('Token ', '')
        user = UserModel.objects.get(auth_token=auth_token)
        queryset = HistoryModel.objects.filter(user=user)
        serializer = HistorySerializer(queryset, many=True)

        if queryset:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request):
        id_list = json.loads(request.body)['id_list']
        deleted_history = HistoryModel.objects.filter(id__in=id_list).delete()

        if deleted_history:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserProfile(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        auth_token = request.headers['Authorization'].replace('Token ', '')
        user = UserModel.objects.get(auth_token=auth_token)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = get_object_or_404(UserModel, email=request.data.get('email'))
        serializer = UserSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user_id = request.query_params.get('id')
        deleted_user = UserModel.objects.filter(id=user_id).delete()

        if deleted_user:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ChangePassword(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        auth_token = request.headers['Authorization'].replace('Token ', '')
        user = UserModel.objects.get(auth_token=auth_token)
        serializer = ChangePasswordSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckSuperuserStatus(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Check user status, returns id and (is_superuser: true or false)."""
        auth_token = request.headers['Authorization'].replace('Token ', '')
        user = UserModel.objects.get(auth_token=auth_token)
        serializer = StatusSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserAdministration(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = UserModel.objects.all()
        serializer = UserAdministrationSerializer(queryset, many=True)

        if queryset:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        user = get_object_or_404(UserModel, email=request.data.get('email'))
        serializer = UserAdministrationSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        id_list = json.loads(request.body)['id_list']
        deleted_obj = UserModel.objects.filter(id__in=id_list).delete()

        if deleted_obj:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
