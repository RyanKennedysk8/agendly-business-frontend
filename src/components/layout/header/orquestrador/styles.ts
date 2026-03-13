import { StyleSheet } from "react-native";
import { Colors } from "@colors/color";
import { a, l, td } from "@constants/responsive";
import { fonts } from "@assets/fonts/fonts";


const size = td(35);
const sizePerfilBox = td(30);
const sizePerfil = td(27);

export const styles = StyleSheet.create({

// ------------- Wrappers (SafeArea) ---------------
  safeArea: {
    
  },
  safeAreaHome: {
    backgroundColor: Colors.white,
  },
  safeAreaSearch: {
    backgroundColor: Colors. corContainer,
  },
  safeAreaId: { 
  },
  safeAreanull: { 
    backgroundColor:Colors.white
  },
  safeAreaScheduling: {
    backgroundColor:Colors.white
  }, 
  safeAreaInfoStore: {
    backgroundColor:Colors.white
  }, 
  safeAreaList: {
    backgroundColor:Colors.white
  },

// ------------- Header Home ---------------
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    height:a(40),
    paddingHorizontal:l(10),
    paddingBottom:a(5)
  },
  logoImg: {
    height:a(20),
    width:l(20)
  },
  logo: {
    height:a(60),
    width:l(70)
  },
  handle: {
    flexDirection: 'row',
    alignItems:"center",
    gap:td(5)
  },
  txtEndereco:{
    fontFamily:fonts.robotoRegular,
    fontSize:td(12),
    color:Colors.corText
  },

// ------------- Header Detalhes da Loja e Animações ---------------
  containerId: { 
    paddingHorizontal: l(10),
    overflow: 'visible',
   
  },
  boxIconTransparente: {
    height: td(35),
    width: td(35),
    borderRadius: td(17.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  iconOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  rightIconsContainer: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap:l(10)
  },
  boxIconGlass: {
    height: td(35),
    width: td(35),
    borderRadius: td(17.5),
    backgroundColor: 'rgba(255, 255, 255, 1)', // Vidro escuro para contraste no banner
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainerAbsolute: {
    position: "absolute",
    right: 0,
    left: 0,
    justifyContent: 'center',
    
  },
  miniInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: td(8),
    height: a(35),
    paddingHorizontal: l(10),
    flex: 1,
    marginLeft: l(10), // Espaço para a seta de voltar
  },
  miniInput: { 
    flex: 1,
    marginLeft: l(5),
    fontSize: td(13),
    fontFamily: fonts.robotoRegular,
    color: Colors.placeholder,
  },

  // Estilo para o StoreSearchHeader (Full Screen mode)
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:"center",
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: Colors.white, 
    paddingHorizontal: l(10),
    paddingBottom:td(10)
  },
  cancelButton: {
    height: a(35),
    paddingLeft:l(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainerAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  textInput: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: td(8),
    paddingLeft:l(5),
    paddingRight:l(5),
    backgroundColor: '#f5f5f5',
    height: a(35),
    flex: 1, 
  },
  searchInput: {
    flex: 1,
    fontSize: td(13),
    paddingLeft:l(5),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText, 
  },
  txtCancelSearch:{
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
    color: Colors.corText,
  },
  clearIcon: {
    marginLeft: l(5),
  },
  boxIcon:{
    height:size,
    width:size,
    borderRadius:size/2,
    backgroundColor:Colors.corScreenDisable,
    justifyContent:"center",
    alignItems:"center",
  },
  searchPageContainer: {
    flex: 1, 
    backgroundColor: 'white',
  },
  
  // Exclusivos Animated
  animatedHeaderContainer: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'flex-end',     
    alignItems: 'center',           
    paddingBottom: a(12),            
    backgroundColor: Colors.corScreen, 
  },
  animatedHeaderTitle: {
      fontFamily: fonts.robotoMedium,
      fontSize: td(16),
      color: Colors.white,
  },
// ------------- Agendamentos (Schedulings) ---------------
  containerScheduling: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height:a(40),
    paddingHorizontal:l(15),
    gap:td(10),
    borderBottomWidth:0.5, 
    borderColor:Colors.border
  },
  txtTitle:{
    fontSize:td(14),
    fontFamily:fonts.robotoMedium,
    color:Colors.corText
  },
  containerAppointment:{  
    backgroundColor:Colors.white,
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-between',
    height:a(40),
    paddingHorizontal:l(15),
    marginHorizontal:l(5),
    marginTop:a(5),
    borderRadius:td(8),
  },
  containerIconAppointment:{
    paddingRight:td(20)
  },
  txtTitleList:{
    fontSize:td(12),
    fontFamily:fonts.robotoMedium
  },
// ------------- Header de Busca (Search) ---------------
  containerSearch:{
    backgroundColor:Colors.corContainer, 
    height:a(80),
  },
  containerOnSearch:{
    backgroundColor:Colors.corContainer, 
    height:a(55),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(10),
    borderRadius: td(20),
    backgroundColor: '#fff',
    height: a(35), 
    borderWidth:td(0.5),
    borderColor:Colors.border,
    flex: 1, 
  },
  searchIcon: { 
    marginRight: l(10) 
  },
  cancelButtonText: {
    color: Colors.corText,
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    paddingRight:l(5)
  },
  locationButtonContainer: {
    backgroundColor:Colors.white,
    height:a(25),
    justifyContent:"center",
    alignItems:"center",
    borderBottomColor:Colors.border,
    borderBottomWidth:1
  },
  locationButton:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:td(7)
  },
  textLocationButton:{
    color: Colors.corText ,
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
  },
  searchInputs: { 
    flex: 1,  
    fontSize: td(10), 
    color: '#000', 
    fontFamily:fonts.robotoMedium,
  },
// ------------- Header de Categoria e Simples ---------------
  containerCategory:{
    flexDirection:'row',
    backgroundColor:Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between', 
    height:a(40),
    paddingHorizontal:l(10),
    marginHorizontal:l(5),
    marginVertical:a(5),
    borderRadius:td(8)
  },
  title: {
    fontSize: td(15),
    fontFamily:fonts.robotoMedium,
    color: Colors.corText,
    textAlign: 'center'
  },
  
  containerSimple:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    width: '100%',
    height:a(40),
    paddingHorizontal:l(10),
    gap:td(10),
  },

  titleProfile: {
    fontSize: td(14),
    fontFamily:fonts.robotoMedium,
    color: Colors.corText,
    textAlign: 'center'
  },

// ------------- Header de Perfil ---------------
  containerProfile:{
    backgroundColor:Colors.white,
    alignItems: 'center',
    justifyContent: 'center', 
    height:a(40),
    marginHorizontal:l(5),
    marginTop:a(5),
    borderRadius:td(8)
  },
  txtProfile:{
    fontFamily:fonts.robotoMedium,
    fontSize:td(14),
    color:Colors.corText,
  },
  containerProfileCustom: {
    height:a(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: l(15),
    borderBottomWidth:0.5, 
    borderColor:Colors.border
  },
  containerHeader: {
    flexDirection:"row",
    alignItems: 'center',
    paddingBottom: a(15),
    paddingHorizontal:l(15),
    backgroundColor: Colors.white,
  },

  containerHeaderInfo:{
    paddingHorizontal:l(15),
    backgroundColor:Colors.white
  },
  containerInfo:{
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      marginBottom:a(15)
  },
  containerTextStore:{
      flexShrink: 1,
      justifyContent:"flex-start", 

  },
  containerDistanceCategory:{
      flexDirection:"row",
      gap:l(5)
  },
  containerAvaliable:{ 
      flexDirection:"row",
      justifyContent:"space-between",
      marginBottom:a(10)
  },
  containerAvaliableIcon:{
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center" 
  },
  logoStore:{
      height:td(40),
      width:td(40),
      borderRadius:td(20),
      marginLeft:l(10),
      backgroundColor:"#f0f0f0",
      borderColor:"#f0f0f0",
      borderWidth:0.5
      
  },
  txtNameStore:{
      fontFamily:fonts.robotoMedium,
      fontSize:td(18),
      color:Colors.corText,
      paddingBottom:a(5)
  },
  txtCategory:{
      fontFamily:fonts.robotoRegular,
      fontSize:td(12),
      color:Colors.corTextSecondary
  },
  txtDistance:{
      fontFamily:fonts.robotoRegular,
      fontSize:td(12),
      color:Colors.corTextSecondary
  },
  txtAvaliable:{
      fontFamily:fonts.robotoRegular,
      fontSize:td(12),
      color:Colors.corTextSecondary
  },
  txtAvaliableNumber:{
      fontFamily:fonts.robotoMedium,
      fontSize:td(12),
      color:Colors.corText
  },          
  avatarHeader: {
    width: td(45),
    height: td(45),
    borderRadius: td(25),
    marginRight:l(15),
    borderWidth: td(1),
    borderColor: Colors.white, 
  },
  containerAvatarNull:{
    width: td(50),
    height: td(50),
    borderRadius: td(25),
    marginRight:l(15),
    justifyContent:"center",
    alignItems:"center",
    
  },
  nameHeader: {
    fontSize: l(14),
    fontFamily:fonts.robotoMedium,
    color: Colors.corText,
  },
  emailHeader: {
  
    fontSize: l(10),
    color: Colors.corTextSecondary,
  },

});