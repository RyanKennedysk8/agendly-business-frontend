import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackHeaderProps, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedValue } from 'react-native-reanimated';
import { Colors } from '@colors/color';
import { 
  BackSimple, 
  SchedulingHeader, 
  EditeProfileHeader, 
  CategoryHeader, 
  HomeHeader, 
  SearchHeaderScreens, 
  ProfileHeader, 
  SubProfile, 
  AuthHeader, 
  ListHeader 
} from '../';
import { AttendanceMainHeader } from '../AttendanceMainHeader';
import { AttendanceSubHeader } from '../AttendanceSubHeader';


export function CustomHeader({ options }: NativeStackHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const statusBarHeights = insets.top;
  const headerType = (options as any).headerType;
  const rawTitle = options.headerTitle;
  const title = typeof rawTitle === 'string' ? rawTitle : '';
  const searchHeaderParams = (options as any).searchHeaderParams;
  const subProfile = (options as any).subProfile;
  const colorIcon = (options as any).colorIcon;
  const attendanceParams = (options as any).attendanceParams;

  switch (headerType) {

    case 'home':
      return(  
        <View style={[styles.safeAreaHome, { paddingTop: statusBarHeights }]}>
          <HomeHeader/>
        </View>
      );

    case 'headerScheduling': 
      return (
        <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
          <SchedulingHeader onBack={router.back} title={title} />
        </View>
      ); 

    case 'search': 
      return(
        <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights}]}>
          <SearchHeaderScreens 
          onBack={router.back} {...searchHeaderParams}/>
        </View>
      );

    case 'category':
      return( 
        <View style={{ paddingTop: statusBarHeights }}>
          <CategoryHeader title={title || "Categoria"} onBack={router.back}/>
        </View>
      );  

    case 'profile':  
      return( 
        <View style={{ paddingTop: statusBarHeights }}> 
          <ProfileHeader/> 
        </View>
      ); 

    case 'subProfile':  
      return(
        <View style={{ paddingTop: statusBarHeights }}>
          <SubProfile title={title || 'Categoria'} onBack={router.back} {...subProfile}/>
        </View>
      );

    case 'auth':
      return (
        <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
          <AuthHeader title={title} onBack={router.back} />
        </View>
      );

    case 'attendanceMain':
      return (
          <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
            <AttendanceMainHeader
              title={title || 'Caixa & Operação'} 
              {...attendanceParams} 
            />
          </View>
      );
  
    case 'attendanceSub':
      return (
          <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
            <AttendanceSubHeader
              title={title} 
              onBack={attendanceParams?.onCustomBack || router.back} 
              {...attendanceParams} 
            />
          </View>
      );

    case 'simple':
      return(
        <View style={[styles.safeAreaHome, { paddingTop: statusBarHeights }]}>
          <BackSimple onBack={router.back} colorIcon={colorIcon}/>
        </View>
      );

    case 'list':
      return(
        <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
          <ListHeader />
        </View>
      );

    case 'custom':
      return (
        <View style={[styles.safeAreaWhite]}>
          <EditeProfileHeader 
            onBack={router.back} 
            title={title} 
            
          />
        </View>
      );

    case 'null': 
      return <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]} />;
      
    case 'nullCollor': 
      return <View style={{ paddingTop: statusBarHeights }} />;
      
    default:
      return null;
  }
}

// Estilos estritos de encapsulamento do Orquestrador
const styles = StyleSheet.create({
  safeAreaHome: {
    backgroundColor: Colors.white,
  },
  safeAreaSearch: {
    backgroundColor: Colors.corContainer,
  },
  safeAreaWhite: {
    backgroundColor: Colors.white,
  },
  absoluteContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 100 
  }
});