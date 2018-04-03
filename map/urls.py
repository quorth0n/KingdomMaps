from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('<int:year>/', views.index, name='index'),
    path('edit/', views.nation_form, name='nation_form'),
    path('edit/<int:edit_pk>', views.nation_form, name='nation_form'),
]#  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
