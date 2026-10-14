import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { l, a, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';

// ==========================================
// GEOMETRIAS DOS ESQUELETOS (FANTASMAS)
// ==========================================

export const EmployeeSkeleton = () => (
  <View style={styles.employeeCard}>
    <Skeleton width={td(44)} height={td(44)} borderRadius={td(22)} style={{ marginRight: l(16) }} />
    <View style={styles.infoContainer}>
      <Skeleton width="60%" height={td(16)} borderRadius={td(4)} style={{ marginBottom: a(4) }} />
      <Skeleton width="40%" height={td(13)} borderRadius={td(4)} />
    </View>
    <Skeleton width={td(18)} height={td(18)} borderRadius={td(9)} />
  </View>
);

export const ServiceSkeleton = () => (
  <View style={styles.serviceCard}>
    <Skeleton width={td(26)} height={td(26)} borderRadius={td(4)} style={{ marginRight: l(10) }} />
    <View style={styles.serviceDragHandleBottom}>
      <Skeleton width={l(2)} height={a(32)} borderRadius={td(2)} style={{ marginRight: l(12) }} />
      <View style={{ flex: 1 }}>
         <Skeleton width="50%" height={td(14)} borderRadius={td(4)} style={{ marginBottom: a(4) }} />
         <Skeleton width="30%" height={td(12)} borderRadius={td(4)} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: l(8) }}>
        <Skeleton width={l(60)} height={td(15)} borderRadius={td(4)} />
        <Skeleton width={td(16)} height={td(16)} borderRadius={td(8)} />
      </View>
    </View>
  </View>
);

export const ClientSkeleton = () => (
  <View style={styles.clientCard}>
    <View style={styles.infoContainer}>
      <Skeleton width="70%" height={td(16)} borderRadius={td(4)} style={{ marginBottom: a(5) }} />
      <Skeleton width="40%" height={td(12)} borderRadius={td(4)} />
    </View>
    <View style={{ flexDirection: "row", gap: l(5) }}>
      <Skeleton width={td(36)} height={td(36)} borderRadius={td(8)} />
      <Skeleton width={td(36)} height={td(36)} borderRadius={td(8)} />
      <Skeleton width={td(36)} height={td(36)} borderRadius={td(8)} />
    </View>
  </View>
);

// ==========================================
// ITERADOR GENÉRICO DE LISTA (WORKER)
// ==========================================

interface SkeletonListProps {
  count?: number;
  ItemComponent: React.ElementType;
  contentContainerStyle?: object;
  separatorStyle?: object;
}

export const SkeletonList = ({ 
  count = 6, 
  ItemComponent, 
  contentContainerStyle,
  separatorStyle 
}: SkeletonListProps) => {
  return (
    <View style={[{ flex: 1 }, contentContainerStyle]}>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          <ItemComponent />
          {index !== count - 1 && <View style={[styles.separator, separatorStyle]} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: { flex: 1, justifyContent: 'center' },
  separator: {
    height: 1,
    backgroundColor: Colors.border || '#F1F5F9',
    marginLeft: l(76), // Margem padrão do app
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: l(20),
    paddingVertical: a(14),
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(10),
    marginRight: l(5)
  },
  serviceDragHandleBottom: {
    flexDirection: 'row',  
    alignItems: 'center', 
    justifyContent: "space-between", 
    flex: 1,
    borderBottomWidth: 1, 
    borderColor: Colors.border || '#F1F5F9', 
    paddingVertical: a(10)
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: l(20),
    paddingVertical: a(10),
    borderBottomColor: Colors.border || '#F1F5F9',
    borderBottomWidth: 1
  }
});