from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class NationPoints(models.Model):
    nationID = models.CharField(max_length=10)
    year = models.IntegerField()
    points = ArrayField(
        ArrayField(
            models.IntegerField(),
            size=2,
        )
    )

class NationInfo(models.Model):
    nationID = models.CharField(max_length=10)
    name = models.CharField(max_length=30)
    local = models.CharField(max_length=30)
    color = models.CharField(max_length=5)
    ruler = models.CharField(max_length=15)

    #Govt
    MONARCHY_ABS = 'MA'
    MONARCHY_CNST = 'MC'
    REPUBLIC_OLI = 'RO'
    REPUBLIC_CNST = 'RC'
    REPUBLIC_PLT = 'RP'
    REPUBLIC_SOC = 'RS'
    DICTATORSHIP_FASCIST = 'DF'
    DICTATORSHIP_SOCIALIST = 'DS'
    THEOCRACY = 'TO'
    TRIBAL = 'TR'
    GOV_CHOICES = (
        (MONARCHY_ABS, 'Monarchy [Absoulte]'),
        (MONARCHY_CNST, 'Monarchy [Constitutional]'),
        (REPUBLIC_OLI, 'Republic [Oligarchic]'),
        (REPUBLIC_CNST, 'Republic [Constitutional]'),
        (REPUBLIC_PLT, 'Republic [Plutocratic]'),
        (REPUBLIC_SOC, 'Republic [Socialist]'),
        (DICTATORSHIP_FASCIST, 'Dictatorship [Fascist]'),
        (DICTATORSHIP_SOCIALIST, 'Dictatorship [Socialist]'),
        (THEOCRACY, 'Theocracy'),
        (TRIBAL, 'Tribal'),
    )
    gov = models.CharField(
        max_length=2,
        choices=GOV_CHOICES,
        default=MONARCHY_ABS,
    )
    
