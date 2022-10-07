from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserModel, HistoryModel


@admin.register(UserModel)
class UserAdmin(UserAdmin):
    model = UserModel

    list_display = (
        'username', 'email', 'is_superuser', 'last_login', 'is_active'
    )
    search_fields = ('username', 'email')
    readonly_fields = ('last_login', 'is_active')

admin.site.register(HistoryModel)
