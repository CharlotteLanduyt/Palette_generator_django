from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


class Color_train(models.Model):
    r = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(255)])
    g = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(255)])
    b = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(255)])

    class Meta:
        db_table = "color_train" 

class Theme_train(models.Model):
   theme = models.CharField(max_length=200)
   colors = models.ManyToManyField(Color_train, name="theme_color")

   class Meta:
        db_table = "theme_train" 


class Main_color(models.Model):
    session_key = models.CharField(max_length=40, unique=True, default="")
    web_palette = models.ForeignKey(Theme_train, on_delete=models.SET_NULL, name="session_palette", null=True)

    class Meta:
        db_table = "session_palette"

