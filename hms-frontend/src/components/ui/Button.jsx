const Button = ({ children, onClick, type = "button", disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles.button}
    >
      {children}
    </button>
  );
};

const styles = {
  button: {
    padding: "10px 16px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Button;
