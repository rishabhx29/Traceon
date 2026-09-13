import { useState } from 'react';
import {
    Box,
    Layout,
    Wrench,
    FileCode2,
    Settings,
    File,
    Braces,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const LEGEND_ITEMS = [
    { type: 'entry', label: 'Entry Point', color: '#f59e0b', Icon: Box },
    { type: 'component', label: 'Component', color: '#8b5cf6', Icon: Layout },
    { type: 'utility', label: 'Utility', color: '#06b6d4', Icon: Wrench },
    { type: 'module', label: 'Module', color: '#10b981', Icon: FileCode2 },
    { type: 'type', label: 'Type', color: '#eab308', Icon: Braces },
    { type: 'config', label: 'Config', color: '#f97316', Icon: Settings },
    { type: 'other', label: 'Other', color: '#64748b', Icon: File },
];

export default function Legend() {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 20,
                left: 60,
                zIndex: 30,
                borderRadius: 12,
                padding: 12,
                background: 'rgba(13,13,13,0.9)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                minWidth: isMinimized ? 'auto' : 150,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginBottom: isMinimized ? 0 : 8 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 'wider' as const, color: '#6b7280', fontWeight: 500 }}>Legend</div>
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    style={{
                        padding: 2,
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        color: '#9ca3af',
                    }}
                    aria-label={isMinimized ? 'Expand legend' : 'Minimize legend'}
                >
                    {isMinimized ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            </div>
            {!isMinimized && (
                <>
                    {LEGEND_ITEMS.map(({ type, label, color, Icon }) => (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
                            <div
                                style={{
                                    background: `${color}15`,
                                    border: `1px solid ${color}35`,
                                    borderRadius: 4,
                                    padding: 2,
                                    display: 'flex',
                                }}
                            >
                                <Icon size={10} style={{ color }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>{label}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 4 }}>
                        <div style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertTriangle size={10} style={{ color: '#f87171' }} /> Critical Module
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
