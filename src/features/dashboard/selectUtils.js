export const customStyles = {
  option: (styles, state) => ({
    ...styles,
    cursor: "pointer",
    overflow: "visible",
  }),
  valueContainer: (styles, state) => ({
    ...styles,
    cursor: "pointer",
    overflow: "visible",
    whiteSpace: "wrap",
  }),
  control: (provided, state) => ({
    ...provided,
    border: "none",
    borderRadius: "4px",
    padding: "2%",
    outline: "none",
    cursor: "pointer",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
  }),
  // option: (provided, state) => ({
  //   ...provided,
  //   backgroundColor: state.isSelected ? "#ced4da" : "white",
  //   color: state.isSelected ? "white" : "black",
  //   borderColor: state.isSelected ? "transparent" : provided.borderColor,
  // }),
}
