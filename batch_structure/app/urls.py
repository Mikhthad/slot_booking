from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('logout/', views.logout_user),
    path('slots/<int:year>/<int:month>/', views.monthlySlotsView),
    path('slot/add/', views.addSlotView),
    path('slot/selected/', views.selectedSlotsView),
    path('slot/delete/<int:slot_id>/', views.deleteSelectedSlotView),
    path('schedule/', views.ScheduledClassesView),
    path('login-check/', views.loginRedirectCheck),
    path('generate-schedule/', views.generateMonthlySchedule),
    path("calendar/<int:year>/<int:month>/", views.calendarView),
]