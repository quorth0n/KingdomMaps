from django.shortcuts import render, redirect
from django.http import HttpResponse

from .models import *
from .forms import *

# Create your views here.

def index(req, year):
    pts = NationPoints.objects.filter(year=year)
    context = {
        'pts': pts
    }
    return render(req, 'map/map.html', context)

def nation_form(req, nation_id=0):
    if req.method == "POST":
        form_pts = PostForm(req.POST)
        form_info = InfoForm(req.POST)
        if form_pts.is_valid() and form_info.is_valid():
            new_pts = form_pts.save(commit=False)
            new_pts.save()
            new_info = form_info.save(commit=False)
            new_info.save()
            return redirect('index', year=post.pk)
    else:
        
        if edit_pk is 0:
            form_pts = PostForm()
        else:
            form_pts = PostForm(pk=NationPoints.objects.get())
        form_info = InfoForm()
    return render(req, 'map/nation_form.html', {'form_pts': form_pts, 'form_info': form_info})

