// components/common/AppIcon.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/colors/color';

interface AppIconProps {
    icon: LucideIcon;
    size?: number;
    color?: string;
    strokeWidth?: number;
    absoluteStroke?:boolean;
}

export function AppIcon({
    icon: Icon,
    size = 24,
    color = Colors.corText,
    strokeWidth = 2,
    absoluteStroke
}: AppIconProps) {
    return (
        <Icon
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            absoluteStrokeWidth={absoluteStroke}
        />
    );
}