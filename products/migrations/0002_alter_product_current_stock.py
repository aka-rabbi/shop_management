# Generated by Django 3.2.3 on 2021-05-18 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='current_stock',
            field=models.IntegerField(),
        ),
    ]
