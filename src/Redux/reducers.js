const initialState = {
    userData: {
      printCr: '',
      light: '',
      area: '',
      printAreaOptimize: '',
      printPerCr: '',
    },
    csvData: [],
    selectedRowId: null,
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_USER_DATA':
        return {
          ...state,
          userData: action.payload,
        };
      case 'SET_CSV_DATA':
        return {
          ...state,
          csvData: action.payload,
        };
      case 'SET_SELECTED_ROW_ID':
        return {
          ...state,
          selectedRowId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;