# Generated by Django 3.2.13 on 2022-06-08 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Drop_sim',
            fields=[
                ('norad_id', models.IntegerField(primary_key=True, serialize=False)),
                ('sat_name', models.TextField()),
                ('intldes', models.TextField()),
                ('country', models.TextField()),
                ('msg_epoch', models.DateTimeField()),
                ('decay_epoch', models.DateTimeField()),
                ('rcs', models.TextField()),
                ('source', models.TextField()),
                ('typeobj', models.TextField()),
                ('dataset', models.TextField()),
            ],
        ),
    ]