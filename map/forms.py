from django.forms import ModelForm
from .models import NationPoints, NationInfo

class PointsForm(ModelForm):
    class Meta:
        model = NationPoints
        exclude = ['nationID'] 

class InfoForm(ModelForm):
    class Meta:
        model=NationInfo
        exclude = ['nationID']
