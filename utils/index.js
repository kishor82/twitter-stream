const appendQueryParameter = (uri, key, value) => {
  // append query parameters with existing url
  if (Array.isArray(value)) {
    value = value.join(",");
  }
  let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  const separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
};

module.exports = {
  appendQueryParameter,
};
