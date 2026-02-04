from datetime import date, timedelta
from calendar import monthrange
from .models import Batch, ClassSlot, Topic, SelectedSlot

def is_sunday(d):
    return d.weekday() == 6
def generate_batches_and_slots(year, month):
    if Batch.objects.filter(year=year, month=month).exists():
        return

    topics = list(Topic.objects.all().order_by("id")[:7])
    if len(topics) < 7:
        raise ValueError("Need at least 7 topics")

    current_date = date(year, month, 1)
    batch_number = 1

    while batch_number <= 3 and current_date.month == month:
        if is_sunday(current_date):
            current_date += timedelta(days=1)
            continue

        batch_start = current_date
        batch_slots = []
        day_count = 1

        while day_count <= 7:
            if not is_sunday(current_date):
                batch_slots.append(current_date)
                day_count += 1
            current_date += timedelta(days=1)

        batch_end = batch_slots[-1]

        batch = Batch.objects.create(
            month=month,
            year=year,
            batch_number=batch_number,
            start_date=batch_start,
            end_date=batch_end,
        )

        for i, slot_date in enumerate(batch_slots):
            ClassSlot.objects.create(
                batch=batch,
                day_number=i + 1,
                topic=topics[i],
                class_date=slot_date,
                is_selectable=True,
            )

        current_date = batch_end + timedelta(days=3)  # 2-day gap
        batch_number += 1


def generate_date_table(user, year, month):
    first_day = date(year, month, 1)
    start_offset = (first_day.weekday() + 1) % 7
    calendar_start = first_day - timedelta(days=start_offset)

    selected_slot_ids = set(
        SelectedSlot.objects.filter(user=user)
        .values_list("slot_id", flat=True)
    )

    slots = {
        s.class_date: s
        for s in ClassSlot.objects.filter(
            class_date__year=year,
            class_date__month=month
        )
    }

    date_table = []

    for i in range(42):
        current_date = calendar_start + timedelta(days=i)
        slot = slots.get(current_date)

        date_table.append({
            "date": current_date,
            "day": current_date.day,
            "is_current_month": current_date.month == month,
            "is_sunday": current_date.weekday() == 6,
            "is_selectable": slot.is_selectable if slot else False,
            "batch_id": slot.batch_id if slot else None,
            "day_number": slot.day_number if slot else None,
            "topic": slot.topic.name if slot and slot.topic else None,
            "is_selected": slot.id in selected_slot_ids if slot else False,
            "slot_id": slot.id if slot else None,
        })

    return date_table
