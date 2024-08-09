import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
  },
  dropdownTrigger: {
  },
  dropdownOptions: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'lightgray',
    overflow: 'hidden',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 4,
    minWidth: 140,
  },
  dropdownOption: {
    alignItems: 'center',
    textAlign: 'center',
  },
  dropdownButton: {
    padding: 10,
    width: '100%',
    backgroundColor: 'white',
  },
  dropdownButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
  },
  dropdownOverlay: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: 4000,
    height: 4000,
    transform: [{ translateY: '-50%' }, { translateX: '-50%' }],
  },
});

export default styles;
