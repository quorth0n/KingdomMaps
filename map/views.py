from django.shortcuts import render
from django.http import HttpResponse

from .models import *

# Create your views here.

def index(req, year):
    pts = NationPoints.objects.filter(year=year)
    context = {
        pts: pts
    }
    return render(req, 'map/map.html', context)
