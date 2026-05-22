// src/components/home/QuickActionsPanel.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface QuickActionsPanelProps {
  actions: QuickActionItem[]; 
  onActionPress: (route: string) => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ actions, onActionPress }) => {
  const { width } = useWindowDimensions();


  const ITEMS_TO_SHOW = 4.5;
  const PADDING_HORIZONTAL = l(20);
  const GAP = l(12);
  
  const ITEM_WIDTH = (width - PADDING_HORIZONTAL - (GAP * Math.floor(ITEMS_TO_SHOW))) / ITEMS_TO_SHOW;

  return (
    <View style={styles.section}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { gap: GAP }]}
        bounces={true}
        snapToInterval={ITEM_WIDTH + GAP} 
        decelerationRate="fast"
      >
        {actions.map((action) => ( 
          <Pressable 
            key={action.id}
            style={[styles.actionBtn, { width: ITEM_WIDTH }]} 
            onPress={() => onActionPress(action.route)}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: Colors.corContainer}]}>
              <Ionicons name={action.icon} size={td(24)} color={Colors.corScreen} />
            </View>
            <Text style={styles.actionText} >{action.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { 
    marginBottom: a(20),
    marginHorizontal: -l(20),
  }, 
  sectionHeaderRow: {
    paddingHorizontal: l(20),
    marginBottom: a(12),
  },
  sectionTitle: {
    fontSize: td(16),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
  },
  scrollContent: { 
    paddingHorizontal: l(20),
  },
  actionBtn: { 
    alignItems: 'center'
  },
  actionIconWrapper: {
    width: td(60),
    height: td(60),
    borderRadius: td(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: a(8),
  },
  actionText: {
    fontSize: td(10),
    fontFamily: fonts.robotoMedium,
    color: Colors.corText,
    width: '100%',
    textAlign: 'center', 
  },
});