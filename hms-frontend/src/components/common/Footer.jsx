const Footer = () => {
  return (
    <div style={styles.footer}>
      © {new Date().getFullYear()} Hospital Management System
    </div>
  );
};

const styles = {
  footer: {
    width: "100%",
    textAlign: "center",
    padding: "12px",
    backgroundColor: "#f5f5f5",
    borderTop: "1px solid #ddd",
    fontSize: "14px",
    color: "#555"
  }
};

export default Footer;
