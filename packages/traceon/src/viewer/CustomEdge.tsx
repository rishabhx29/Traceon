import { memo } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

function TraceonEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {},
}: EdgeProps) {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
    });

    const isHighlighted = data?.isHighlighted as boolean | undefined;

    let stroke = 'rgba(255,255,255,0.08)';
    let strokeWidth = 1;
    let zIndex = 0;

    if (isHighlighted) {
        stroke = '#34d399';
        strokeWidth = 2;
        zIndex = 20;
    }

    return (
        <BaseEdge
            id={id}
            path={edgePath}
            style={{
                ...style,
                strokeWidth,
                stroke,
                zIndex,
                transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
            }}
        />
    );
}

export default memo(TraceonEdge);
