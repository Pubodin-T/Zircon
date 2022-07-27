# Generated by Django 3.2.14 on 2022-07-27 07:20

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
                ('uncertainty', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Launch_site',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
        ),
    ]
