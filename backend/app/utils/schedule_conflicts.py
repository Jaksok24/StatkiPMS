from datetime import datetime, timedelta


def overlaps(start_a, end_a, start_b, end_b):
    return start_a < end_b and start_b < end_a


def reservation_range(reservation_date, reservation_time, duration_minutes):
    start_dt = datetime.combine(reservation_date, reservation_time)
    end_dt = start_dt + timedelta(minutes=duration_minutes)
    return start_dt, end_dt


def break_range(break_date, start_time, end_time):
    start_dt = datetime.combine(break_date, start_time)
    end_dt = datetime.combine(break_date, end_time)
    return start_dt, end_dt