from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializer import UserSerializer, UserProfileSerializer, TopicSerializer, BatchSerializer, ClassSlotSerializer, SelectedSlotSerializer
from .models import UserProfile, Topic, Batch, ClassSlot, SelectedSlot
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .utils import generate_batches_and_slots, generate_date_table
from rest_framework.decorators import authentication_classes
from .authentication import CsrfExemptSessionAuthentication


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([CsrfExemptSessionAuthentication])
def register_user(request):
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    password = request.data.get('password')
    email = request.data.get('email')
    phone = request.data.get('phone')

    if not all([first_name, last_name, password, email, phone]):
        return Response({'detail':'All fields requiresd'}, status=400)
    if User.objects.filter(username = email).exists():
        return Response({"detail": "Email already exists"}, status=400)
    username = email
    user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name ,email=email, password=password)

    UserProfile.objects.create(
        user = user,
        phone = phone
    )
    return Response({'detail':"User register successfully"}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([CsrfExemptSessionAuthentication])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username = email, password = password)
    if user is None:
        return Response({"detail": "Invalid credentials"}, status=400)
    login(request, user)
    profile = get_object_or_404(UserProfile, user=user)
    serializer = UserProfileSerializer(profile)
    return Response({"detail":"Login Successful", "user":serializer.data}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def logout_user(request):
    logout(request)
    return Response({"detail": "Logged out successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def monthlySlotsView(request, year, month):
    slots = ClassSlot.objects.filter(
            class_date__year=year,
            class_date__month=month
        )
    serializer = ClassSlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def addSlotView(request):
    slot_id = request.data.get('slot_id')

    try:
        slot = ClassSlot.objects.get(id=slot_id)
    except ClassSlot.DoesNotExist:
        return Response({"error": "Slot not found"}, status=404)

    if slot.class_date.weekday() == 6:
        return Response({"error": "Sunday slots are not allowed"}, status=400)

    if not slot.is_selectable:
        return Response({"error": "Slot not selectable"}, status=400)

    SelectedSlot.objects.get_or_create(
        user=request.user,
        slot=slot
    )

    return Response({"message": "Slot added"}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def selectedSlotsView(request):
    slots = SelectedSlot.objects.filter(user = request.user)
    serializer = SelectedSlotSerializer(slots, many = True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def deleteSelectedSlotView(request, slot_id):
    SelectedSlot.objects.filter(
            user=request.user,
            slot_id= slot_id
        ).delete()
    return Response({"message": "Slot deleted"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def ScheduledClassesView(request):
    selected = SelectedSlot.objects.filter(user=request.user)
    serializer = SelectedSlotSerializer(selected, many=True)
    return Response(serializer.data)    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def loginRedirectCheck(request):
    has_slots = SelectedSlot.objects.filter(user=request.user).exists()

    if has_slots:
        return Response({"redirect": "page3"})
    return Response({"redirect": "page1"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def generateMonthlySchedule(request):
    year = request.data.get('year')
    month = request.data.get('month')

    if not year or not month:
        return Response({"error": "Year and month required"}, status=400)

    generate_batches_and_slots(int(year), int(month))
    return Response({"message": "Schedule generated"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendarView(request, year, month):
    data = generate_date_table(request.user, year, month)
    return Response(data)