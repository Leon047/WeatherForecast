"""Backend URL Configuration for weather_forecast API"""

from django.urls import path
from .views import (GestForecastView,
                    UserForecastView,
                    HistoryListView,
                    UserProfile,
                    ChangePassword,
                    CheckSuperuserStatus,
                    UserAdministration)

urlpatterns = [
    path('gest/', GestForecastView.as_view(), name='gest'),
    path('user/', UserForecastView.as_view(), name='user'),
    path('history/', HistoryListView.as_view(), name='history'),
    path('profile/', UserProfile.as_view(), name='profile'),
    path('change_password/', ChangePassword.as_view(), name='change_password'),
    path('check_status/', CheckSuperuserStatus.as_view(), name='status'),
    path('users_list/', UserAdministration.as_view(), name='users_list')
]
