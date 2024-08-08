import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
  },
  dropdownTrigger: {
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    right: 0,
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
    zIndex: 10000,
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
    position: 'relative',
    backgroundColor: 'transparent',
    zIndex: 9999,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  }
});

export default styles;
