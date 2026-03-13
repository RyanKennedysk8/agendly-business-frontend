import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedValue } from 'react-native-reanimated';
import { Colors } from '@colors/color';
import { 
  BackSimple, 
  StoreSearchHeader, 
  DetailSearchHeaderAnimated, 
  SchedulingHeader, 
  EditeProfileHeader, 
  CategoryHeader, 
  HomeHeader, 
  SearchHeader, 
  ProfileHeader, 
  SubProfile, 
  AuthHeader, 
  ListHeader 
} from '../';


export function CustomHeader({ options }: NativeStackHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const statusBarHeights = insets.top;
  const headerType = (options as any).headerType;
  const isSearching = (options as any).isSearching;
  const rawTitle = options.headerTitle;
  const title = typeof rawTitle === 'string' ? rawTitle : '';
  const onSearchPressCallback = (options as any).onSearchPress;
  const scrollY = (options as any).scrollY as SharedValue<number> | undefined;
  const storeSearchParams = (options as any).storeSearchParams;
  const storeInfoParams = (options as any).storeInfoParams;
  const searchHeaderParams = (options as any).searchHeaderParams;
  const homeHeaderParams = (options as any).homeHeaderParams;
  const subProfile = (options as any).subProfile;
  const colorIcon = (options as any).colorIcon;
  const headerRight = options.headerRight;
  const goNavigate = (options as any).goNavigate as () => void;
  const showReview = (options as any).showReview as boolean;

  switch (headerType) {
    case 'headerStore':
      if (isSearching) {
        return (
          <View style={styles.safeAreaHome}>
            <StoreSearchHeader {...storeSearchParams} onBack={router.back} />
          </View>
        ); 
      } 
      return (
        <View style={styles.absoluteContainer}>
          {scrollY && storeSearchParams && (
            <DetailSearchHeaderAnimated
              onBack={router.back}
              onSearchPress={onSearchPressCallback}
              scrollY={scrollY}
              searchTerm={storeSearchParams.searchTerm}
              setSearchTerm={storeSearchParams.setSearchTerm}
              lojaNome={storeSearchParams.lojaNome}
              onClear={storeSearchParams.onClear}
              isFavorite={storeSearchParams.isFavorite}
              onHeartPress={storeSearchParams.onHeartPress}
            />
          )}
        </View>
      );

    case 'headerScheduling':
      return (
        <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
          <SchedulingHeader onBack={router.back} title={title} />
        </View>
      ); 

    case 'custom':
      return (
        <View style={[styles.safeAreaWhite, { paddingTop: statusBarHeights }]}>
          <EditeProfileHeader 
            onBack={router.back} 
            title={title} 
            rightComponent={headerRight ? headerRight({ tintColor: Colors.corText }) : undefined}
          />
        </View>
      );

    case 'category':
      return( 
        <View style={{ paddingTop: statusBarHeights }}>
          <CategoryHeader title={title || "Categoria"} onBack={router.back}/>
        </View>
      );  

    case 'home':
      return(  
        <View style={[styles.safeAreaHome, { paddingTop: statusBarHeights }]}>
          <HomeHeader {...homeHeaderParams} />
        </View>
      );

    case 'search': 
      return(
        <View style={[styles.safeAreaSearch, { paddingTop: statusBarHeights}]}>
          <SearchHeader {...searchHeaderParams}/>
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