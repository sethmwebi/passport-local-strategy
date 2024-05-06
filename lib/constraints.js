let _ = {};

_.name = () => {
  const constraints = {
    presence: {
      allowEmpty: false,
    },
    type: "string",
  };
  return constraints;
};

_.email = () => {
  const constraints = {
    presence: { allowEmpty: false, type: "string", email: true },
  };
  return constraints;
};

_.password = () => {
  const constraints = {
    presence: { allowEmpty: false, type: "string", length: { minimum: 6 } },
  };
  return constraints;
};

module.exports = _;
