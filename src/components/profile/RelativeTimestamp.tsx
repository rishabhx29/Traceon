"use client";

import { useEffect, useState, useSyncExternalStore } from 'react';

interface RelativeTimestampProps {
    date?: string | Date;
}

const emptySubscribe = () => () => {};

function getRelativeTimeString(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

    if (diffMins < 1) return 'Analyzed just now';
    if (diffMins < 60) return `Analyzed ${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `Analyzed ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Analyzed ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

export function RelativeTimestamp({ date }: RelativeTimestampProps) {
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const [relativeTime, setRelativeTime] = useState(() => date ? getRelativeTimeString(date) : '');

    useEffect(() => {
        if (!date) return;
        const update = () => setRelativeTime(getRelativeTimeString(date));
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [date]);

    if (!mounted || !date) return null;

    return (
        <span className="text-xs text-text-3 font-mono">
            {relativeTime}
        </span>
    );
}
